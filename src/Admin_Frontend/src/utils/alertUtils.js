import Swal from 'sweetalert2';

export const showDeleteConfirm = async (
  title = "Bạn chắc chắn chứ?",
  message = "Hành động này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống."
) => {
  const result = await Swal.fire({
    title: title,
    
    // 🔥 Dùng HTML để tô màu chữ quan trọng
    html: `
      <div style="margin-top: 8px">
        ${message} <br/>
        Dữ liệu sẽ <span class="highlight-text-danger">không thể khôi phục</span> sau khi xóa!
      </div>
    `,
    
    icon: 'warning', // Icon dấu chấm than
    showCancelButton: true,
    
    confirmButtonText: 'Xóa ngay',
    cancelButtonText: 'Hủy bỏ',

    buttonsStyling: false,
    
    customClass: {
      popup: 'pro-alert-popup',
      title: 'pro-alert-title',
      htmlContainer: 'pro-alert-text',
      confirmButton: 'pro-alert-btn btn-danger-pro',
      cancelButton: 'pro-alert-btn btn-secondary-pro',
      icon: 'pro-alert-icon',
      actions: 'pro-alert-actions'
    },
    
    // Animation nảy lên (pop-up)
    showClass: {
        popup: 'animate__animated animate__fadeInUp animate__fast'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__fast'
    }
  });

  return result.isConfirmed;
};