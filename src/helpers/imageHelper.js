export const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
        img.src = e.target.result;
    };

    img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (!blob) return reject(new Error("Canvas is empty"));
                    const resizedFile = new File([blob], file.name, { type: file.type });
                    resolve(resizedFile);
                },
            file.type,
            quality
        );
    };

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
    });
};  