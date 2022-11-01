let productList = [];

const myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
  keyboard: false,
});


// RENDER PRODUCTLIST
// 1.Call API hiển thị product list
const fetchProduct = async () => {
  try {
    const res = await axios.get(
      "https://6350d1293e9fa1244e4dd61b.mockapi.io/Products"
    );
    productList = res.data;
    renderProducts(productList);
  } catch (err) {
    console.log(err);
  }
};

// 2. Hiển thị product list ra màn hình
const renderProducts = (data) => {
  let productHTML = "";
  productHTML = data
    .map(
      (product, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
            <img class="img-product" src="${product.img}" alt="Product">
        </td>
        <td>
            <div>
                 <p>Type: ${product.type}</p>
                 <p>Screen: ${product.screen}</p>
                 <p>Back camera: ${product.backCamera}</p>
                 <p>Front camera: ${product.frontCamera}</p>
                 <p>Desc: ${product.desc}</p>
            </div>
        </td>
        <td>
        <button type="button" onclick="getUpdateProduct(${
          product.id
        })" class="btn btn-success my-2"    
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">Cập nhật</button>    
        <button type="button" onclick="deleteProduct(${
          product.id
        })" class="btn btn-danger my-2">Xoá</button>
        </td>
    </tr>
    `
    )
    .join("");
  document.getElementById("tblProductList").innerHTML = productHTML;
};

const getFormValue = () => {
  const name = document.getElementById("nameProduct").value;
  const price = document.getElementById("priceProduct").value;
  const img = document.getElementById("imgProduct").value;
  const type = document.getElementById("typeProduct").value;
  const screen = document.getElementById("screenProduct").value;
  const backCamera = document.getElementById("backCameraProduct").value;
  const frontCamera = document.getElementById("frontCameraProduct").value;
  const desc = document.getElementById("descProduct").value;
  const product = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  return product;
};
// ADD PRODUCT
const addProduct = async () => {
  let isFormValid = validateForm();
  if (!isFormValid) return;
  // 1. Lấy input
  const newProduct = getFormValue();
  //   2. Tạo product mới
  try {
    await axios.post(
      "https://6350d1293e9fa1244e4dd61b.mockapi.io/Products",
      newProduct
    );
    fetchProduct();
    // clear input
    // document.getElementById('formProduct').reset();
  } catch (err) {
    console.log(err);
  }
  myModal.hide();
};

// DELETE PRODUCT
const deleteProduct = async (id) => {
  try {
    await axios.delete(
      `https://6350d1293e9fa1244e4dd61b.mockapi.io/Products/${id}`
    );
    fetchProduct();
  } catch (err) {
    console.log(err);
  }
};

// UPDATE PRODUCT
// UPDATE phần 1: Lấy thông tin show lên form
const getUpdateProduct = (id) => {
  let product = productList.find((item) => item.id == id);

  // hiện form ra khi ấn nút cập nhật: gắn class vào button Cập nhật: data-bs-toggle="modal" data-bs-target="#exampleModal"

  // đổ thông tin Product lên input
  document.getElementById("productId").value = product.id;
  document.getElementById("nameProduct").value = product.name;
  document.getElementById("priceProduct").value = product.price;
  document.getElementById("imgProduct").value = product.img;
  document.getElementById("typeProduct").value = product.type;
  document.getElementById("screenProduct").value = product.screen;
  document.getElementById("backCameraProduct").value = product.backCamera;
  document.getElementById("frontCameraProduct").value = product.frontCamera;
  document.getElementById("descProduct").value = product.desc;
};

// UPDATE phần 2: Cho sửa thông tin trên form => Nhấn nút Cập nhật thì lưu thay đổi
const updateProduct = async () => {
  let isFormValid = validateForm();
  if (!isFormValid) return;
  const product = getFormValue();
  const id = document.getElementById("productId").value;
  try {
    await axios.put(
      `https://6350d1293e9fa1244e4dd61b.mockapi.io/Products/${id}`,
      product
    );
    
  } catch (err) {
    console.log(err);
  };
  fetchProduct();
  myModal.hide();
};

// VALIDATION FORM
const validateForm = () => {
  let product = getFormValue();

  let isValid = true;
  isValid &= required(product.name, "noticeName");
  isValid &=
    required(product.price, "noticePrice") &&
    number(product.price, "noticePrice");
  isValid &= required(product.img, "noticeImg");
  isValid &= required(product.type, "noticeType");
  isValid &= required(product.screen, "noticeScreen");
  isValid &= required(product.backCamera, "noticeBackCamera");
  isValid &= required(product.frontCamera, "noticeFrontCamera");
  isValid &= required(product.desc, "noticeDesc");

  return isValid;
};

// required: không được để trống
const required = (val, spanId) => {
  console.log(val?.length);
  if (val?.length === 0) {
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập!";
    document.getElementById(spanId).style.display = "block";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};

// check price
const number = (val, spanId) => {
  let pattern = /^[0-9]+$/;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML = "*Nhập kí tự dạng số!";
  document.getElementById(spanId).style.display = "block";
  return false;
};

window.onload = () => {
  fetchProduct();
  document.getElementById("btnAdd").addEventListener("click", addProduct);
};
