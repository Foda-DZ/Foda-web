import api from "../lib/api";
import type { ApiCustomerProfile } from "../types/api";

export const customerService = {
  // GET /customer/profile — backend returns the profile object directly (no wrapper)
  getProfile: () =>
    api
      .get<ApiCustomerProfile>("/customer/profile")
      .then((r) => r.data),

  // POST /customer/profile/image — returns { message, imageUrl: string } (Cloudinary URL)
  uploadProfileImage: (file: File) => {
    const form = new FormData();
    form.append("ProfileImage", file);
    return api
      .post<{ message: string; imageUrl: string }>(
        "/customer/profile/image",
        form,
        // Unset Content-Type so axios auto-sets multipart/form-data with boundary
        { headers: { "Content-Type": undefined } },
      )
      .then((r) => r.data.imageUrl);
  },
};
