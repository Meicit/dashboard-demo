// Liên thông các dịch vụ kết nối tài nguyên từ tệp cấu hình cùng cấp
import { db, storage } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

/**
 * Hàm phát sinh Mã phản ánh ngẫu nhiên (Tracking Code)
 * Định dạng: 8 ký tự bao gồm chữ cái in hoa (A-Z) và số (0-9)
 */
function generateTrackingCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Lắng nghe sự kiện gửi biểu mẫu phản ánh từ giao diện phan-anh.html
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi tải lại trang mặc định của form

    const submitBtn = document.getElementById('submitBtn');
    const fullname = document.getElementById('fullname').value.trim();
    const cccd = document.getElementById('cccd').value.trim();
    const email = document.getElementById('email').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageFile = document.getElementById('imageFile').files[0];

    // 1. Kiểm tra định dạng số CCCD (Phải đủ và đúng 12 chữ số)
    const cccdRegex = /^\d{12}$/;
    if (!cccdRegex.test(cccd)) {
        alert("⚠️ Số Căn cước công dân không hợp lệ! Vui lòng nhập đúng và đủ 12 chữ số.");
        document.getElementById('cccd').focus();
        return;
    }

    // Khóa trạng thái nút bấm và hiển thị thông báo để tránh người dân click spam liên tục
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Hệ thống đang tải dữ liệu lên...</span>`;

    try {
        let imageUrl = "";

        // 2. Xử lý tải hình ảnh lên Cloud Storage nếu người dân có chọn tệp minh họa
        if (imageFile) {
            // Tách đuôi mở rộng của tệp (png, jpg,...)
            const fileExtension = imageFile.name.split('.').pop();
            // Khởi tạo tên file duy nhất bằng timestamp để không bị ghi đè dữ liệu trên Cloud
            const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
            
            // Tạo đường dẫn tham chiếu đến thư mục complaints/ trên Storage
            const storageRef = ref(storage, `complaints/${uniqueFileName}`);
            
            // Tiến hành upload dữ liệu thô
            const uploadResult = await uploadBytes(storageRef, imageFile);
            // Trích xuất link URL công khai của hình ảnh để lưu vào cơ sở dữ liệu chữ
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        // 3. Khởi tạo cấu trúc bản ghi tài liệu đồng bộ dữ liệu Firestore
        const trackingCode = generateTrackingCode();
        const complaintData = {
            trackingCode: trackingCode, // Mã 8 ký tự phục vụ công tác tra cứu của người dân
            fullname: fullname,
            cccd: cccd,
            email: email,
            content: content,
            imageUrl: imageUrl,         // Sẽ là chuỗi rỗng "" nếu đơn không đính kèm ảnh
            status: "Đang tiếp nhận",   // Trạng thái xử lý khởi tạo mặc định
            replyContent: "",           // Phản hồi từ ban ngành (mặc định để trống)
            createdAt: new Date().toISOString() // Thời gian hệ thống ghi nhận đơn thư
        };

        // 4. Liên thông ghi bản ghi mới vào Bộ sưu tập (Collection) có tên là "complaints"
        await addDoc(collection(db, "complaints"), complaintData);

        // 5. Đổ Mã tra cứu vừa sinh ra vào giao diện Modal và kích hoạt hiển thị bung màn hình
        document.getElementById('trackingCodeDisplay').innerText = trackingCode;
        
        const modal = document.getElementById('successModal');
        const card = document.getElementById('modalCard');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-95');

    } catch (error) {
        console.error("Lỗi xảy ra trong tiến trình lưu trữ dữ liệu Firebase:", error);
        alert("⚠️ Đã xảy ra sự cố kết nối với hệ thống Backend Firebase. Vui lòng kiểm tra lại đường truyền internet!");
    } finally {
        // Mở khóa lại nút bấm sau khi chu trình nộp đơn hoàn tất
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Xác nhận gửi phản ánh</span> 🚀`;
    }
});
