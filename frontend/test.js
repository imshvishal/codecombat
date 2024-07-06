let x = "https://res.cloudinary.com/krvishal/image/upload/v1/codecombat/avatar/qlb7popplc9obhr0pgdw.png"
let y = "https://res.cloudinary.com/krvishal/raw/upload/v1719029357/zu3so77kduokczol8gth.py"

function processImageUrl(imageUrl, width=100) {
    if (imageUrl.includes("cloudinary.com")) {
        return imageUrl.replace(/\/upload\/(v\d+\/)?/, `/upload/w_${width}/`)
    }
    return imageUrl
}

console.log(processImageUrl(y, width=500));