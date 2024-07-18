import React, { useState } from "react";

function ImageUpload() {
  const [base64Image, setBase64Image] = useState("");

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      e.target?.result && setBase64Image(e.target.result as string);
    event.target.files && reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {base64Image && <img src={base64Image} alt="Uploaded Image" />}
    </div>
  );
}

export default ImageUpload;
