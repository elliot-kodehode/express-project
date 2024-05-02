const container = document.getElementById("container");
const apiData = async () => {
    const data = await fetch("http://localhost:3000/api/products/66");
    const result = await data.json();
    console.log(result)

    const imageData = new Blob([new Uint8Array(result.data.image_data.data)], { type: result.data.image_type });
    const imageUrl = URL.createObjectURL(imageData);
    
    const productImg = document.createElement("img");
    productImg.src = imageUrl;
    container.append(productImg)
}
apiData()

