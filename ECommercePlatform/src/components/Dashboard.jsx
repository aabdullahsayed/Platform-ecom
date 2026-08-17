import { useEffect, useMemo, useState } from "react";
import { logout } from "../api/authService";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE_URL = "http://localhost:5299";

const API_URL = `${API_BASE_URL}/api/products`;
const RAG_API_URL = `${API_BASE_URL}/api/rag/ask`;

const ORDERS_API_URL = `${API_BASE_URL}/api/users/orders`;
const PROFILE_API_URL = `${API_BASE_URL}/api/users/profile`;
const ADDRESSES_API_URL = `${API_BASE_URL}/api/users/addresses`;

const IMAGE_BASE_URL = API_BASE_URL;

const PAGE_SIZE = 12;
const ORDER_PAGE_SIZE = 10;


// =====================================================
// CATEGORIES
// =====================================================

const CATEGORIES = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Books" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Sports" },
];


// =====================================================
// ORDER STATUS
// =====================================================

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
];


// =====================================================
// API RESPONSE HELPER
// =====================================================

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


// =====================================================
// PRODUCTS API
// =====================================================

async function getProducts({
  page = 1,
  pageSize = PAGE_SIZE,
  categoryId,
  minPrice,
  maxPrice,
} = {}) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (minPrice !== "" && minPrice !== undefined) {
    params.append("minPrice", minPrice);
  }

  if (maxPrice !== "" && maxPrice !== undefined) {
    params.append("maxPrice", maxPrice);
  }

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load products."
    );
  }

  return data;
}


async function getSellerProducts() {
  const response = await fetch(
    `${API_URL}/seller`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load seller products."
    );
  }

  return data;
}


// =====================================================
// RAG API
// =====================================================

async function askRag(question) {
  const response = await fetch(
    RAG_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        question,
      }),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to get AI response."
    );
  }

  return data;
}


// =====================================================
// ORDER API
// =====================================================

async function getOrders(page = 1) {
  const response = await fetch(
    `${ORDERS_API_URL}?page=${page}&pageSize=${ORDER_PAGE_SIZE}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load orders."
    );
  }

  return data;
}


async function getOrderDetails(orderId) {
  const response = await fetch(
    `${ORDERS_API_URL}/${orderId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load order."
    );
  }

  return data;
}


async function getOrderTracking(orderId) {
  const response = await fetch(
    `${ORDERS_API_URL}/${orderId}/track`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to track order."
    );
  }

  return data;
}


// =====================================================
// PROFILE API
// =====================================================

async function getProfile() {
  const response = await fetch(
    PROFILE_API_URL,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load profile."
    );
  }

  return data;
}


async function updateProfile(profile) {
  const response = await fetch(
    PROFILE_API_URL,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profile),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to update profile."
    );
  }

  return data;
}


// =====================================================
// ADDRESS API
// =====================================================

async function getAddresses() {
  const response = await fetch(
    ADDRESSES_API_URL,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to load addresses."
    );
  }

  return data;
}


async function createAddress(address) {
  const response = await fetch(
    ADDRESSES_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(address),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to create address."
    );
  }

  return data;
}


async function updateAddress(id, address) {
  const response = await fetch(
    `${ADDRESSES_API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(address),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to update address."
    );
  }

  return data;
}


async function deleteAddress(id) {
  const response = await fetch(
    `${ADDRESSES_API_URL}/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.title ||
        "Failed to delete address."
    );
  }

  return data;
}


// =====================================================
// COMPONENT
// =====================================================

export default function Dashboard({
  user,
  onLogout,
}) {
  // ===================================================
  // ROLE
  // ===================================================

  const role = user?.role || "Customer";

  const isSeller = role === "Seller";
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";

  const canManageProducts =
    isSeller || isAdmin;


  // ===================================================
  // ACTIVE SECTION
  // ===================================================

  const [activeSection, setActiveSection] =
    useState("overview");


  // ===================================================
  // GLOBAL UI
  // ===================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] =
    useState(1);
  const [totalItems, setTotalItems] =
    useState(0);


  // ===================================================
  // PRODUCT FILTERS
  // ===================================================

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] =
    useState("");
  const [minPrice, setMinPrice] =
    useState("");
  const [maxPrice, setMaxPrice] =
    useState("");


  // ===================================================
  // CREATE PRODUCT
  // ===================================================

  const [showCreate, setShowCreate] =
    useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] =
    useState("");
  const [createCategoryId, setCreateCategoryId] =
    useState("");
  const [status, setStatus] =
    useState("Draft");
  const [images, setImages] = useState([]);
  const [creating, setCreating] =
    useState(false);


  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const [editingProduct, setEditingProduct] =
    useState(null);
  const [updating, setUpdating] =
    useState(false);
  const [deletingId, setDeletingId] =
    useState(null);


  // ===================================================
  // RAG
  // ===================================================

  const [showAssistant, setShowAssistant] =
    useState(false);

  const [ragQuestion, setRagQuestion] =
    useState("");

  const [ragAnswer, setRagAnswer] =
    useState("");

  const [ragLoading, setRagLoading] =
    useState(false);

  const [ragError, setRagError] =
    useState("");


  // ===================================================
  // ORDERS
  // ===================================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersPage, setOrdersPage] =
    useState(1);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orderLoading, setOrderLoading] =
    useState(false);

  const [trackingOrder, setTrackingOrder] =
    useState(null);


  // ===================================================
  // PROFILE
  // ===================================================

  const [profile, setProfile] = useState(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [profileSaving, setProfileSaving] =
    useState(false);


  // ===================================================
  // ADDRESSES
  // ===================================================

  const [addresses, setAddresses] =
    useState([]);

  const [addressesLoading, setAddressesLoading] =
    useState(false);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(null);

  const [addressSaving, setAddressSaving] =
    useState(false);

  const [addressForm, setAddressForm] =
    useState({
      addressLine: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });


  // ===================================================
  // LOAD PRODUCTS
  // ===================================================

  useEffect(() => {
    loadProducts();
  }, [
    page,
    categoryId,
    minPrice,
    maxPrice,
    role,
  ]);


  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      if (isSeller) {
        const data =
          await getSellerProducts();

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );

        setTotalItems(
          Array.isArray(data)
            ? data.length
            : 0
        );

        setTotalPages(1);
      } else {
        const data =
          await getProducts({
            page,
            pageSize: PAGE_SIZE,
            categoryId,
            minPrice,
            maxPrice,
          });

        setProducts(
          data?.products || []
        );

        setTotalItems(
          data?.totalItems || 0
        );

        setTotalPages(
          data?.totalPages || 1
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };


  // ===================================================
  // FILTER PRODUCTS
  // ===================================================

  const filteredProducts = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          ?.toLowerCase()
          .includes(value) ||
        product.description
          ?.toLowerCase()
          .includes(value) ||
        product.categoryName
          ?.toLowerCase()
          .includes(value)
    );
  }, [products, search]);


  // ===================================================
  // CATEGORY
  // ===================================================

  const getCategoryName = (id) => {
    const category =
      CATEGORIES.find(
        (item) =>
          item.id === Number(id)
      );

    return category?.name || "Unknown";
  };


  // ===================================================
  // IMAGE URL
  // ===================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${IMAGE_BASE_URL}${image}`;
    }

    return `${IMAGE_BASE_URL}/${image}`;
  };


  // ===================================================
  // CREATE PRODUCT
  // ===================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!createCategoryId) {
      setError(
        "Please select a category."
      );
      return;
    }

    setCreating(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "Name",
        name
      );

      formData.append(
        "Description",
        description
      );

      formData.append(
        "Price",
        price
      );

      formData.append(
        "StockQuantity",
        stockQuantity
      );

      formData.append(
        "CategoryId",
        createCategoryId
      );

      formData.append(
        "Status",
        status
      );

      images.forEach((image) => {
        formData.append(
          "Images",
          image
        );
      });

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.title ||
            "Failed to create product."
        );
      }

      setName("");
      setDescription("");
      setPrice("");
      setStockQuantity("");
      setCreateCategoryId("");
      setStatus("Draft");
      setImages([]);

      setShowCreate(false);

      setSuccess(
        "Product created successfully. Embedding generated."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          "Failed to create product."
      );
    } finally {
      setCreating(false);
    }
  };


  // ===================================================
  // UPDATE PRODUCT
  // ===================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response =
        await fetch(
          `${API_URL}/${editingProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name:
                editingProduct.name,

              description:
                editingProduct.description,

              price:
                Number(
                  editingProduct.price
                ),

              stockQuantity:
                Number(
                  editingProduct.stockQuantity
                ),

              categoryId:
                Number(
                  editingProduct.categoryId
                ),

              status:
                editingProduct.status,
            }),
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.title ||
            "Failed to update product."
        );
      }

      setEditingProduct(null);

      setSuccess(
        "Product updated successfully."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          "Failed to update product."
      );
    } finally {
      setUpdating(false);
    }
  };


  // ===================================================
  // DELETE PRODUCT
  // ===================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.title ||
            "Failed to delete product."
        );
      }

      setSuccess(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };


  // ===================================================
  // LOAD ORDERS
  // ===================================================

  const loadOrders = async (
    requestedPage = ordersPage
  ) => {
    setOrdersLoading(true);
    setError("");

    try {
      const data =
        await getOrders(
          requestedPage
        );

      const list =
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.orders ||
            [];

      setOrders(list);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };


  // ===================================================
  // ORDER DETAILS
  // ===================================================

  const openOrderDetails = async (
    orderId
  ) => {
    setOrderLoading(true);
    setError("");

    try {
      const data =
        await getOrderDetails(
          orderId
        );

      setSelectedOrder(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load order."
      );
    } finally {
      setOrderLoading(false);
    }
  };


  // ===================================================
  // TRACK ORDER
  // ===================================================

  const trackOrder = async (
    orderId
  ) => {
    try {
      const data =
        await getOrderTracking(
          orderId
        );

      setTrackingOrder(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to track order."
      );
    }
  };


  // ===================================================
  // LOAD PROFILE
  // ===================================================

  const loadProfile = async () => {
    setProfileLoading(true);

    try {
      const data =
        await getProfile();

      setProfile(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };


  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleProfileSave = async (
    e
  ) => {
    e.preventDefault();

    if (!profile) {
      return;
    }

    setProfileSaving(true);

    try {
      const updated =
        await updateProfile(
          profile
        );

      setProfile(
        updated || profile
      );

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };


  // ===================================================
  // LOAD ADDRESSES
  // ===================================================

  const loadAddresses = async () => {
    setAddressesLoading(true);

    try {
      const data =
        await getAddresses();

      setAddresses(
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.addresses ||
            []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load addresses."
      );
    } finally {
      setAddressesLoading(false);
    }
  };


  // ===================================================
  // ADDRESS FORM
  // ===================================================

  const resetAddressForm = () => {
    setAddressForm({
      addressLine: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });

    setEditingAddress(null);
    setShowAddressForm(false);
  };


  const openAddressEdit = (
    address
  ) => {
    setEditingAddress(address);

    setAddressForm({
      addressLine:
        address.addressLine || "",

      city:
        address.city || "",

      postalCode:
        address.postalCode || "",

      country:
        address.country || "",

      isDefault:
        address.isDefault || false,
    });

    setShowAddressForm(true);
  };


  // ===================================================
  // SAVE ADDRESS
  // ===================================================

  const handleAddressSave = async (
    e
  ) => {
    e.preventDefault();

    setAddressSaving(true);

    try {
      if (editingAddress) {
        await updateAddress(
          editingAddress.id,
          addressForm
        );

        setSuccess(
          "Address updated successfully."
        );
      } else {
        await createAddress(
          addressForm
        );

        setSuccess(
          "Address added successfully."
        );
      }

      resetAddressForm();

      await loadAddresses();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save address."
      );
    } finally {
      setAddressSaving(false);
    }
  };


  // ===================================================
  // DELETE ADDRESS
  // ===================================================

  const handleAddressDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this address?"
      )
    ) {
      return;
    }

    try {
      await deleteAddress(id);

      setSuccess(
        "Address deleted successfully."
      );

      await loadAddresses();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete address."
      );
    }
  };


  // ===================================================
  // RAG
  // ===================================================

  const handleAskRag = async (
    e
  ) => {
    e.preventDefault();

    const question =
      ragQuestion.trim();

    if (!question) {
      return;
    }

    setRagLoading(true);
    setRagError("");
    setRagAnswer("");

    try {
      const data =
        await askRag(question);

      setRagAnswer(
        data?.answer ||
          "No answer was returned."
      );
    } catch (err) {
      setRagError(
        err.message ||
          "Unable to get an answer."
      );
    } finally {
      setRagLoading(false);
    }
  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (err) {
      setError(
        err.message ||
          "Logout failed."
      );
    }
  };


  // ===================================================
  // NAVIGATION
  // ===================================================

  const navigate = (
    section
  ) => {
    setActiveSection(section);
    setSidebarOpen(false);

    if (section === "orders") {
      setOrdersPage(1);
      loadOrders(1);
    }

    if (section === "profile") {
      loadProfile();
    }

    if (section === "addresses") {
      loadAddresses();
    }
  };


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="brand-mark">
            P
          </div>

          <div>
            <strong>
              PLATFORM
            </strong>

            <span>
              Commerce
            </span>
          </div>

        </div>


        <nav className="dashboard-nav">

          <button
            className={
              activeSection === "overview"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("overview")
            }
          >
            Overview
          </button>


          <button
            className={
              activeSection === "products"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("products")
            }
          >
            Products
          </button>


          {isCustomer && (
            <button
              className={
                activeSection === "orders"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                navigate("orders")
              }
            >
              Orders
            </button>
          )}


          <div className="nav-divider" />


          <button
            className={
              activeSection === "profile"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("profile")
            }
          >
            Profile
          </button>


          <button
            className={
              activeSection === "addresses"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate("addresses")
            }
          >
            Addresses
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <strong>
              {user?.username ||
                user?.name ||
                user?.email ||
                "User"}
            </strong>

            <span>
              {role}
            </span>

          </div>


          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            Menu
          </button>


          <div>

            <span className="topbar-label">
              {role} ACCOUNT
            </span>

            <h1>
              {activeSection ===
                "overview" &&
                "Dashboard"}

              {activeSection ===
                "products" &&
                "Products"}

              {activeSection ===
                "orders" &&
                "Orders"}

              {activeSection ===
                "profile" &&
                "Profile"}

              {activeSection ===
                "addresses" &&
                "Addresses"}
            </h1>

          </div>


          <div className="topbar-user">
            <span>
              {user?.email}
            </span>
          </div>

        </header>


        <main className="dashboard-content">

          {/* ALERTS */}

          {error && (
            <div className="alert alert-error">

              <strong>
                Error
              </strong>

              <span>
                {error}
              </span>

              <button
                onClick={() =>
                  setError("")
                }
              >
                Close
              </button>

            </div>
          )}


          {success && (
            <div className="alert alert-success">

              <strong>
                Success
              </strong>

              <span>
                {success}
              </span>

              <button
                onClick={() =>
                  setSuccess("")
                }
              >
                Close
              </button>

            </div>
          )}


          {/* =================================================
              OVERVIEW
          ================================================= */}

          {activeSection ===
            "overview" && (
            <>

              <section className="welcome-section">

                <div>

                  <span className="eyebrow">
                    {role} DASHBOARD
                  </span>

                  <h2>
                    Welcome back,{" "}
                    {user?.username ||
                      user?.name ||
                      user?.email ||
                      "User"}
                  </h2>

                  <p>
                    {isSeller
                      ? "Manage your products and inventory."
                      : isAdmin
                      ? "Manage products and monitor the platform."
                      : "Discover products and manage your orders."}
                  </p>

                </div>


                {canManageProducts && (
                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("products")
                    }
                  >
                    Manage Products
                  </button>
                )}

              </section>


              <section className="stats-grid">

                <div className="stat-card">

                  <span>
                    Products
                  </span>

                  <strong>
                    {totalItems}
                  </strong>

                </div>


                <div className="stat-card">

                  <span>
                    Categories
                  </span>

                  <strong>
                    {CATEGORIES.length}
                  </strong>

                </div>


                <div className="stat-card">

                  <span>
                    Account
                  </span>

                  <strong>
                    {role}
                  </strong>

                </div>


                {isCustomer && (
                  <div className="stat-card">

                    <span>
                      Orders
                    </span>

                    <strong>
                      {orders.length}
                    </strong>

                  </div>
                )}

              </section>


              <section className="dashboard-shortcuts">

                <div className="shortcut-card">

                  <span>
                    Catalog
                  </span>

                  <h3>
                    Browse Products
                  </h3>

                  <button
                    onClick={() =>
                      navigate("products")
                    }
                  >
                    Open Catalog
                  </button>

                </div>


                {isCustomer && (
                  <div className="shortcut-card">

                    <span>
                      Purchases
                    </span>

                    <h3>
                      Order History
                    </h3>

                    <button
                      onClick={() =>
                        navigate("orders")
                      }
                    >
                      View Orders
                    </button>

                  </div>
                )}


                <div className="shortcut-card">

                  <span>
                    Account
                  </span>

                  <h3>
                    Profile Settings
                  </h3>

                  <button
                    onClick={() =>
                      navigate("profile")
                    }
                  >
                    Manage Profile
                  </button>

                </div>

              </section>

            </>
          )}


          {/* =================================================
              PRODUCTS
          ================================================= */}

          {activeSection ===
            "products" && (
            <>

              <section className="products-heading">

                <div>

                  <span className="eyebrow">
                    CATALOG
                  </span>

                  <h2>
                    {isSeller
                      ? "Your Products"
                      : "Featured Products"}
                  </h2>

                </div>


                {canManageProducts && (
                  <button
                    className="primary-button"
                    onClick={() =>
                      setShowCreate(
                        !showCreate
                      )
                    }
                  >
                    {showCreate
                      ? "Close"
                      : "Add Product"}
                  </button>
                )}

              </section>


              {/* CREATE */}

              {showCreate &&
                canManageProducts && (
                <section className="panel">

                  <div className="panel-header">

                    <div>

                      <span className="eyebrow">
                        PRODUCT
                      </span>

                      <h3>
                        Create New Product
                      </h3>

                    </div>

                  </div>


                  <form
                    className="product-form"
                    onSubmit={
                      handleCreate
                    }
                  >

                    <div className="form-grid">

                      <div className="form-group">

                        <label>
                          Product Name
                        </label>

                        <input
                          className="form-control"
                          value={name}
                          onChange={(e) =>
                            setName(
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Category
                        </label>

                        <select
                          className="form-control"
                          value={
                            createCategoryId
                          }
                          onChange={(e) =>
                            setCreateCategoryId(
                              e.target.value
                            )
                          }
                          required
                        >

                          <option value="">
                            Select category
                          </option>

                          {CATEGORIES.map(
                            (category) => (
                              <option
                                key={
                                  category.id
                                }
                                value={
                                  category.id
                                }
                              >
                                {
                                  category.name
                                }
                              </option>
                            )
                          )}

                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Price
                        </label>

                        <input
                          className="form-control"
                          type="number"
                          step="0.01"
                          min="0"
                          value={price}
                          onChange={(e) =>
                            setPrice(
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Stock Quantity
                        </label>

                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          value={
                            stockQuantity
                          }
                          onChange={(e) =>
                            setStockQuantity(
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Status
                        </label>

                        <select
                          className="form-control"
                          value={status}
                          onChange={(e) =>
                            setStatus(
                              e.target.value
                            )
                          }
                        >
                          <option>
                            Draft
                          </option>

                          <option>
                            Published
                          </option>

                          <option>
                            Archived
                          </option>
                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Images
                        </label>

                        <input
                          className="form-control"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) =>
                            setImages(
                              Array.from(
                                e.target.files ||
                                  []
                              )
                            )
                          }
                        />

                      </div>

                    </div>


                    <div className="form-group">

                      <label>
                        Description
                      </label>

                      <textarea
                        className="form-control textarea"
                        value={
                          description
                        }
                        onChange={(e) =>
                          setDescription(
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>


                    <button
                      className="primary-button"
                      disabled={creating}
                    >
                      {creating
                        ? "Creating..."
                        : "Create Product"}
                    </button>

                  </form>

                </section>
              )}


              {/* FILTERS */}

              {!isSeller && (
                <section className="filter-panel">

                  <input
                    className="search-input"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />


                  <select
                    className="filter-control"
                    value={categoryId}
                    onChange={(e) => {

                      setCategoryId(
                        e.target.value
                      );

                      setPage(1);

                    }}
                  >

                    <option value="">
                      All Categories
                    </option>

                    {CATEGORIES.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}

                  </select>


                  <input
                    className="filter-control"
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                  />


                  <input
                    className="filter-control"
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value
                      )
                    }
                  />

                </section>
              )}


              {/* PRODUCTS */}

              {loading ? (
                <div className="loading-state">
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">

                  <h3>
                    No products found
                  </h3>

                  <p>
                    Try changing your filters.
                  </p>

                </div>
              ) : (
                <div className="product-grid">

                  {filteredProducts.map(
                    (product) => {

                      const image =
                        product.images?.length
                          ? getImageUrl(
                              product.images[0]
                            )
                          : null;

                      return (
                        <article
                          className="product-card"
                          key={
                            product.id
                          }
                        >

                          <div className="product-image-wrapper">

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                                className="product-image"
                              />
                            ) : (
                              <div className="image-placeholder">
                                No Image
                              </div>
                            )}

                            <span className="status-badge">
                              {
                                product.status
                              }
                            </span>

                          </div>


                          <div className="product-content">

                            <span className="category-label">
                              {
                                product.categoryName ||
                                getCategoryName(
                                  product.categoryId
                                )
                              }
                            </span>


                            <h3>
                              {
                                product.name
                              }
                            </h3>


                            <p className="product-description">
                              {product.description?.length >
                              100
                                ? `${product.description.substring(
                                    0,
                                    100
                                  )}...`
                                : product.description}
                            </p>


                            <strong className="product-price">
                              $
                              {Number(
                                product.price
                              ).toFixed(2)}
                            </strong>


                            <div className="product-meta">

                              <span>
                                Stock:{" "}
                                {
                                  product.stockQuantity
                                }
                              </span>


                              {!isSeller && (
                                <span>
                                  Seller:{" "}
                                  {
                                    product.sellerName ||
                                    "Unknown"
                                  }
                                </span>
                              )}

                            </div>


                            {canManageProducts && (
                              <div className="product-actions">

                                <button
                                  className="edit-button"
                                  onClick={() =>
                                    setEditingProduct(
                                      {
                                        id:
                                          product.id,

                                        name:
                                          product.name ||
                                          "",

                                        description:
                                          product.description ||
                                          "",

                                        price:
                                          product.price,

                                        stockQuantity:
                                          product.stockQuantity,

                                        categoryId:
                                          product.categoryId,

                                        status:
                                          product.status,
                                      }
                                    )
                                  }
                                >
                                  Edit
                                </button>


                                <button
                                  className="delete-button"
                                  disabled={
                                    deletingId ===
                                    product.id
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      product.id
                                    )
                                  }
                                >
                                  {deletingId ===
                                  product.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>

                              </div>
                            )}


                            {isCustomer && (
                              <button
                                className="cart-button"
                                onClick={() =>
                                  setSuccess(
                                    `${product.name} added to cart.`
                                  )
                                }
                              >
                                Add to Cart
                              </button>
                            )}

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>
              )}


              {/* PAGINATION */}

              {!loading &&
                !isSeller &&
                totalPages > 1 && (
                <div className="pagination">

                  <button
                    disabled={
                      page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current - 1
                      )
                    }
                  >
                    Previous
                  </button>


                  <span>
                    Page {page} of{" "}
                    {totalPages}
                  </span>


                  <button
                    disabled={
                      page >=
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          current + 1
                      )
                    }
                  >
                    Next
                  </button>

                </div>
              )}

            </>
          )}


          {/* =================================================
              ORDERS
          ================================================= */}

          {activeSection ===
            "orders" &&
            isCustomer && (
            <section>

              <div className="section-heading">

                <div>

                  <span className="eyebrow">
                    PURCHASES
                  </span>

                  <h2>
                    Order History
                  </h2>

                  <p>
                    Track your recent orders and
                    view complete order details.
                  </p>

                </div>

              </div>


              {ordersLoading ? (
                <div className="loading-state">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">

                  <h3>
                    No orders yet
                  </h3>

                  <p>
                    Your completed purchases
                    will appear here.
                  </p>

                </div>
              ) : (
                <div className="orders-list">

                  {orders.map(
                    (order) => (
                      <article
                        className="order-card"
                        key={
                          order.id
                        }
                      >

                        <div className="order-main">

                          <div>

                            <span className="order-label">
                              ORDER
                            </span>

                            <h3>
                              #{order.id}
                            </h3>

                          </div>


                          <span
                            className={`order-status status-${String(
                              order.status
                            ).toLowerCase()}`}
                          >
                            {
                              order.status
                            }
                          </span>

                        </div>


                        <div className="order-information">

                          <div>

                            <span>
                              Total
                            </span>

                            <strong>
                              $
                              {Number(
                                order.finalAmount
                              ).toFixed(2)}
                            </strong>

                          </div>


                          <div>

                            <span>
                              Items
                            </span>

                            <strong>
                              {
                                order.items
                                  ?.length ||
                                0
                              }
                            </strong>

                          </div>


                          <div>

                            <span>
                              Date
                            </span>

                            <strong>
                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : "-"}
                            </strong>

                          </div>

                        </div>


                        <div className="order-actions">

                          <button
                            onClick={() =>
                              openOrderDetails(
                                order.id
                              )
                            }
                          >
                            View Details
                          </button>


                          <button
                            onClick={() =>
                              trackOrder(
                                order.id
                              )
                            }
                          >
                            Track Order
                          </button>

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}


              <div className="pagination">

                <button
                  disabled={
                    ordersPage <= 1
                  }
                  onClick={() => {

                    const next =
                      ordersPage - 1;

                    setOrdersPage(
                      next
                    );

                    loadOrders(next);

                  }}
                >
                  Previous
                </button>


                <span>
                  Page {ordersPage}
                </span>


                <button
                  disabled={
                    orders.length <
                    ORDER_PAGE_SIZE
                  }
                  onClick={() => {

                    const next =
                      ordersPage + 1;

                    setOrdersPage(
                      next
                    );

                    loadOrders(next);

                  }}
                >
                  Next
                </button>

              </div>

            </section>
          )}


          {/* =================================================
              PROFILE
          ================================================= */}

          {activeSection ===
            "profile" && (
            <section>

              <div className="section-heading">

                <span className="eyebrow">
                  ACCOUNT
                </span>

                <h2>
                  Profile
                </h2>

                <p>
                  Manage your personal information.
                </p>

              </div>


              {profileLoading ? (
                <div className="loading-state">
                  Loading profile...
                </div>
              ) : profile ? (
                <form
                  className="profile-form panel"
                  onSubmit={
                    handleProfileSave
                  }
                >

                  <div className="form-grid">

                    <div className="form-group">

                      <label>
                        Name
                      </label>

                      <input
                        className="form-control"
                        value={
                          profile.name ||
                          ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            name:
                              e.target.value,
                          })
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Email
                      </label>

                      <input
                        className="form-control"
                        type="email"
                        value={
                          profile.email ||
                          ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            email:
                              e.target.value,
                          })
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Phone
                      </label>

                      <input
                        className="form-control"
                        value={
                          profile.phone ||
                          ""
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                  </div>


                  <button
                    className="primary-button"
                    disabled={
                      profileSaving
                    }
                  >
                    {profileSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </form>
              ) : (
                <div className="empty-state">

                  <p>
                    Profile information
                    could not be loaded.
                  </p>

                </div>
              )}

            </section>
          )}


          {/* =================================================
              ADDRESSES
          ================================================= */}

          {activeSection ===
            "addresses" && (
            <section>

              <div className="section-heading">

                <div>

                  <span className="eyebrow">
                    DELIVERY
                  </span>

                  <h2>
                    Shipping Addresses
                  </h2>

                  <p>
                    Manage your delivery addresses.
                  </p>

                </div>


                <button
                  className="primary-button"
                  onClick={() => {

                    resetAddressForm();

                    setShowAddressForm(
                      true
                    );

                  }}
                >
                  Add Address
                </button>

              </div>


              {showAddressForm && (
                <form
                  className="panel address-form"
                  onSubmit={
                    handleAddressSave
                  }
                >

                  <div className="panel-header">

                    <h3>
                      {editingAddress
                        ? "Edit Address"
                        : "New Address"}
                    </h3>

                  </div>


                  <div className="form-grid">

                    <div className="form-group">

                      <label>
                        Address
                      </label>

                      <input
                        className="form-control"
                        value={
                          addressForm.addressLine
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine:
                              e.target.value,
                          })
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        City
                      </label>

                      <input
                        className="form-control"
                        value={
                          addressForm.city
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city:
                              e.target.value,
                          })
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Postal Code
                      </label>

                      <input
                        className="form-control"
                        value={
                          addressForm.postalCode
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postalCode:
                              e.target.value,
                          })
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Country
                      </label>

                      <input
                        className="form-control"
                        value={
                          addressForm.country
                        }
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country:
                              e.target.value,
                          })
                        }
                        required
                      />

                    </div>

                  </div>


                  <label className="checkbox-label">

                    <input
                      type="checkbox"
                      checked={
                        addressForm.isDefault
                      }
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isDefault:
                            e.target.checked,
                        })
                      }
                    />

                    Set as default address

                  </label>


                  <div className="modal-actions">

                    <button
                      type="button"
                      onClick={
                        resetAddressForm
                      }
                    >
                      Cancel
                    </button>


                    <button
                      className="primary-button"
                      disabled={
                        addressSaving
                      }
                    >
                      {addressSaving
                        ? "Saving..."
                        : "Save Address"}
                    </button>

                  </div>

                </form>
              )}


              {addressesLoading ? (
                <div className="loading-state">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="empty-state">

                  <h3>
                    No saved addresses
                  </h3>

                  <p>
                    Add an address for faster checkout.
                  </p>

                </div>
              ) : (
                <div className="address-grid">

                  {addresses.map(
                    (address) => (
                      <article
                        className="address-card"
                        key={
                          address.id
                        }
                      >

                        <div className="address-card-header">

                          <strong>
                            {
                              address.city
                            }
                          </strong>

                          {address.isDefault && (
                            <span className="default-label">
                              Default
                            </span>
                          )}

                        </div>


                        <p>
                          {
                            address.addressLine
                          }
                        </p>

                        <p>
                          {
                            address.city
                          },{" "}
                          {
                            address.postalCode
                          }
                        </p>

                        <p>
                          {
                            address.country
                          }
                        </p>


                        <div className="address-actions">

                          <button
                            onClick={() =>
                              openAddressEdit(
                                address
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-button"
                            onClick={() =>
                              handleAddressDelete(
                                address.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}

            </section>
          )}

        </main>

      </div>


      {/* =================================================
          RAG ASSISTANT
      ================================================= */}

      <div className="rag-assistant">

        {showAssistant && (
          <div className="rag-window">

            <div className="rag-header">

              <div>

                <strong>
                  Product Assistant
                </strong>

                <span>
                  Semantic product search
                </span>

              </div>


              <button
                onClick={() =>
                  setShowAssistant(
                    false
                  )
                }
              >
                Close
              </button>

            </div>


            <div className="rag-body">

              {!ragAnswer &&
                !ragLoading &&
                !ragError && (
                <div className="rag-welcome">

                  <span className="rag-label">
                    AI PRODUCT SEARCH
                  </span>

                  <h3>
                    Find products using natural language.
                  </h3>

                  <p>
                    Ask about products,
                    categories, specifications,
                    price or availability.
                  </p>


                  <div className="rag-quick-questions">

                    <button
                      onClick={() =>
                        setRagQuestion(
                          "Show me a good laptop for programming"
                        )
                      }
                    >
                      Programming laptops
                    </button>


                    <button
                      onClick={() =>
                        setRagQuestion(
                          "Show me some affordable products"
                        )
                      }
                    >
                      Affordable products
                    </button>


                    <button
                      onClick={() =>
                        setRagQuestion(
                          "What electronics are available?"
                        )
                      }
                    >
                      Electronics
                    </button>

                  </div>

                </div>
              )}


              {ragQuestion && (
                <div className="rag-user-message">

                  <span>
                    You
                  </span>

                  <p>
                    {ragQuestion}
                  </p>

                </div>
              )}


              {ragLoading && (
                <div className="rag-loading-message">

                  <strong>
                    Product Assistant
                  </strong>

                  <p>
                    Searching the product database...
                  </p>

                </div>
              )}


              {ragError && (
                <div className="rag-error">
                  {ragError}
                </div>
              )}


              {ragAnswer &&
                !ragLoading && (
                <div className="rag-answer">

                  <strong>
                    Product Assistant
                  </strong>

                  <p>
                    {ragAnswer}
                  </p>

                </div>
              )}

            </div>


            <form
              className="rag-input-area"
              onSubmit={
                handleAskRag
              }
            >

              <input
                value={
                  ragQuestion
                }
                onChange={(e) =>
                  setRagQuestion(
                    e.target.value
                  )
                }
                placeholder="Ask about products..."
                disabled={
                  ragLoading
                }
              />


              <button
                type="submit"
                disabled={
                  ragLoading ||
                  !ragQuestion.trim()
                }
              >
                Ask
              </button>

            </form>


            {ragAnswer && (
              <button
                className="rag-new-question"
                onClick={() => {

                  setRagQuestion("");
                  setRagAnswer("");
                  setRagError("");

                }}
              >
                New Question
              </button>
            )}

          </div>
        )}


        <button
          className={`rag-floating-button ${
            showAssistant
              ? "active"
              : ""
          }`}
          onClick={() =>
            setShowAssistant(
              !showAssistant
            )
          }
          title="Product Assistant"
        >
          {showAssistant
            ? "Close"
            : "AI"}
        </button>

      </div>


      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="modal order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  ORDER DETAILS
                </span>

                <h2>
                  Order #{selectedOrder.id}
                </h2>

              </div>


              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >
                Close
              </button>

            </div>


            <div className="order-detail-status">

              <span>
                Status
              </span>

              <strong>
                {
                  selectedOrder.status
                }
              </strong>

            </div>


            <div className="order-detail-grid">

              <div>

                <span>
                  Total
                </span>

                <strong>
                  $
                  {Number(
                    selectedOrder.totalAmount
                  ).toFixed(2)}
                </strong>

              </div>


              <div>

                <span>
                  Discount
                </span>

                <strong>
                  $
                  {Number(
                    selectedOrder.discountAmount
                  ).toFixed(2)}
                </strong>

              </div>


              <div>

                <span>
                  Final Amount
                </span>

                <strong>
                  $
                  {Number(
                    selectedOrder.finalAmount
                  ).toFixed(2)}
                </strong>

              </div>

            </div>


            <div className="order-items">

              <h3>
                Items
              </h3>


              {selectedOrder.items?.map(
                (item) => (
                  <div
                    className="order-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {
                          item.productName
                        }
                      </strong>

                      <span>
                        Quantity:{" "}
                        {
                          item.quantity
                        }
                      </span>

                    </div>


                    <strong>
                      $
                      {Number(
                        item.totalPrice
                      ).toFixed(2)}
                    </strong>

                  </div>
                )
              )}

            </div>


            <div className="shipping-address">

              <h3>
                Shipping Address
              </h3>

              <p>
                {
                  selectedOrder.shippingAddress
                }
              </p>

            </div>


            <div className="modal-actions">

              <button
                onClick={() =>
                  trackOrder(
                    selectedOrder.id
                  )
                }
              >
                Track Order
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          TRACKING MODAL
      ================================================= */}

      {trackingOrder && (
        <div
          className="modal-overlay"
          onClick={() =>
            setTrackingOrder(null)
          }
        >

          <div
            className="modal tracking-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  ORDER TRACKING
                </span>

                <h2>
                  Order #
                  {
                    trackingOrder.orderId
                  }
                </h2>

              </div>


              <button
                onClick={() =>
                  setTrackingOrder(
                    null
                  )
                }
              >
                Close
              </button>

            </div>


            <div className="tracking-timeline">

              {ORDER_STATUSES.map(
                (status, index) => {

                  const currentIndex =
                    ORDER_STATUSES.indexOf(
                      trackingOrder.status
                    );

                  const completed =
                    index <=
                    currentIndex;

                  return (
                    <div
                      className={
                        completed
                          ? "tracking-step completed"
                          : "tracking-step"
                      }
                      key={status}
                    >

                      <div className="tracking-marker">
                        {completed
                          ? "OK"
                          : ""}
                      </div>


                      <div>

                        <strong>
                          {status}
                        </strong>

                        {status ===
                          trackingOrder.status && (
                          <span>
                            Current Status
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>


            <div className="tracking-meta">

              <div>

                <span>
                  Created
                </span>

                <strong>
                  {trackingOrder.createdAt
                    ? new Date(
                        trackingOrder.createdAt
                      ).toLocaleString()
                    : "-"}
                </strong>

              </div>


              <div>

                <span>
                  Last Updated
                </span>

                <strong>
                  {trackingOrder.updatedAt
                    ? new Date(
                        trackingOrder.updatedAt
                      ).toLocaleString()
                    : "-"}
                </strong>

              </div>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          EDIT PRODUCT MODAL
      ================================================= */}

      {editingProduct && (
        <div
          className="modal-overlay"
          onClick={() =>
            setEditingProduct(
              null
            )
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  PRODUCT
                </span>

                <h2>
                  Edit Product
                </h2>

              </div>


              <button
                onClick={() =>
                  setEditingProduct(
                    null
                  )
                }
              >
                Close
              </button>

            </div>


            <form
              className="product-form"
              onSubmit={
                handleUpdate
              }
            >

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  className="form-control"
                  value={
                    editingProduct.name
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name:
                        e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  className="form-control textarea"
                  value={
                    editingProduct.description
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description:
                        e.target.value,
                    })
                  }
                  required
                />

              </div>


              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      editingProduct.price
                    }
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={
                      editingProduct.stockQuantity
                    }
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockQuantity:
                          e.target.value,
                      })
                    }
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  className="form-control"
                  value={
                    editingProduct.categoryId
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId:
                        e.target.value,
                    })
                  }
                >

                  {CATEGORIES.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  className="form-control"
                  value={
                    editingProduct.status
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      status:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Draft
                  </option>

                  <option>
                    Published
                  </option>

                  <option>
                    Archived
                  </option>

                </select>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct(
                      null
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  className="primary-button"
                  disabled={updating}
                >
                  {updating
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}