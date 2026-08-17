const API_URL = "http://localhost:5299/api/products";


// ==========================================
// GET ALL PRODUCTS
// ==========================================

export async function getAllProducts({
  page = 1,
  pageSize = 20,
  categoryId,
  minPrice,
  maxPrice,
} = {}) {

  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  if (categoryId !== undefined && categoryId !== "") {
    params.append("categoryId", categoryId);
  }

  if (minPrice !== undefined && minPrice !== "") {
    params.append("minPrice", minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    params.append("maxPrice", maxPrice);
  }

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  return await response.json();
}


// ==========================================
// GET SELLER PRODUCTS
// ==========================================

export async function getSellerProducts() {

  const response = await fetch(
    `${API_URL}/seller`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load seller products."
    );
  }

  return await response.json();
}


// ==========================================
// CREATE PRODUCT
// ==========================================


export async function createProduct(
  product,
  images = []
) {

  const formData = new FormData();

  formData.append(
    "Name",
    product.name
  );

  formData.append(
    "Description",
    product.description
  );

  formData.append(
    "Price",
    product.price.toString()
  );

  formData.append(
    "StockQuantity",
    product.stockQuantity.toString()
  );

  formData.append(
    "CategoryId",
    product.categoryId.toString()
  );

  formData.append(
    "Status",
    product.status
  );


  images.forEach((image) => {

    formData.append(
      "Images",
      image
    );

  });


  const response = await fetch(
    "http://localhost:5299/api/products",
    {
      method: "POST",

      credentials: "include",

      body: formData,
    }
  );


  const text =
    await response.text();


  if (!response.ok) {

    throw new Error(
      text ||
      `Request failed: ${response.status}`
    );
  }


  return text
    ? JSON.parse(text)
    : null;
}
// ==========================================
// UPDATE PRODUCT
// ==========================================

export async function updateProduct(
  id,
  product
) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {

    const text = await response.text();

    let message =
      "Failed to update product.";

    if (text) {

      try {

        const data = JSON.parse(text);

        message =
          data.message ||
          data.title ||
          message;

      } catch {

        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


// ==========================================
// DELETE PRODUCT
// ==========================================

export async function deleteProduct(id) {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {

    const text = await response.text();

    let message =
      "Failed to delete product.";

    if (text) {

      try {

        const data = JSON.parse(text);

        message =
          data.message ||
          data.title ||
          message;

      } catch {

        message = text;
      }
    }

    throw new Error(message);
  }

  return true;
}