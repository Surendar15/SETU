// Cloudinary unsigned upload - the browser uploads directly to Cloudinary's
// servers, no backend involvement. We just get back a URL to store.
const CLOUD_NAME = "ower3pxx"; // from your Cloudinary dashboard
const UPLOAD_PRESET = "setu_donations"; // the unsigned preset you created

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.secure_url; // this is what we save as imageUrl
}
