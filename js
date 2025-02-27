[1mdiff --git a/src/app.js b/src/app.js[m
[1mindex 8dca83d..4620175 100644[m
[1m--- a/src/app.js[m
[1m+++ b/src/app.js[m
[36m@@ -50,7 +50,7 @@[m [mapp.use(flash());[m
 DB.dbConnect()[m
   .then((res) => {[m
     app.listen(port, () => {[m
[31m-      console.log(`http://localhost:${port}/`);[m
[32m+[m[32m      console.log(`http://localhost:${port}/home`);[m
       console.log(`Database connected`);[m
     });[m
   })[m
[1mdiff --git a/src/public/css/dashboard.css b/src/public/css/dashboard.css[m
[1mindex cd2a809..ffee19c 100644[m
[1m--- a/src/public/css/dashboard.css[m
[1m+++ b/src/public/css/dashboard.css[m
[36m@@ -53,9 +53,9 @@[m
   cursor: pointer;[m
 }[m
 #cart {[m
[31m-  position: relative;[m
[32m+[m[32mposition: relative;[m
 }[m
 #cart #items-count {[m
[31m-  position: absolute;[m
[31m-  right: 20px;[m
[31m-}[m
[32m+[m[32m      position: absolute;[m
[32m+[m[32m      right: 20px;[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/src/public/css/index.css b/src/public/css/index.css[m
[1mindex debb91c..99e9dff 100644[m
[1m--- a/src/public/css/index.css[m
[1m+++ b/src/public/css/index.css[m
[36m@@ -26,11 +26,6 @@[m
   display: grid;[m
   grid-template-columns: 20rem 1fr;[m
 }[m
[31m-[m
[31m-.content {[m
[31m-  grid-row: 1/3;[m
[31m-}[m
[31m-[m
 form {[m
   box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);[m
   width: 420px;[m
[1mdiff --git a/src/public/js/login.js b/src/public/js/login.js[m
[1mindex 3f856a6..e563002 100644[m
[1m--- a/src/public/js/login.js[m
[1m+++ b/src/public/js/login.js[m
[36m@@ -50,7 +50,7 @@[m [mdocument.addEventListener("DOMContentLoaded", function () {[m
       }[m
     }[m
   });[m
[31m- [m
[32m+[m
   forgotBtn.addEventListener("click", async (e) => {[m
     e.preventDefault();[m
 [m
[1mdiff --git a/src/public/js/navbar.js b/src/public/js/navbar.js[m
[1mindex 21a33e8..ec24ad5 100644[m
[1m--- a/src/public/js/navbar.js[m
[1m+++ b/src/public/js/navbar.js[m
[36m@@ -9,7 +9,7 @@[m [mconst profileBtn = document.getElementById("profile");[m
 checkRoutes = () => {[m
   const currentPath = window.location.pathname;[m
   switch (currentPath) {[m
[31m-    case "/":[m
[32m+[m[32m    case "/home":[m
       menusBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";[m
       menusBtn.style.color = "white";[m
       break;[m
[36m@@ -83,7 +83,7 @@[m [mif (logoutBtn) {[m
 if (menusBtn) {[m
   menusBtn.addEventListener("click", async (e) => {[m
     e.preventDefault();[m
[31m-    location.replace("/");[m
[32m+[m[32m    location.replace("/home");[m
   });[m
 }[m
 [m
[1mdiff --git a/src/views/includes/dashboard.ejs b/src/views/includes/dashboard.ejs[m
[1mindex a94d00c..0b0fe6c 100644[m
[1m--- a/src/views/includes/dashboard.ejs[m
[1m+++ b/src/views/includes/dashboard.ejs[m
[36m@@ -19,33 +19,33 @@[m
       <i class="ri-list-ordered"></i>[m
       My Orders[m
     </div>[m
[31m-    <div class="link">[m
[31m-      <i class="ri-add-line"></i>[m
[31m-      Add[m
[32m+[m[32m    <div class="link" id="cart">[m
[32m+[m[32m      <i class="ri-shopping-cart-2-line"></i>[m
[32m+[m[32m      Cart[m
[32m+[m[32m      <span id="items-count">0</span>[m
     </div>[m
     <div class="link" id="profile">[m
       <i class="ri-user-line"></i>[m
       Profile[m
     </div>[m
[31m-      <!-- show only if user is logged in -->[m
[31m-      <% if (currUser) { %>[m
[31m-      <div class="link" id="logout-btn">[m
[31m-        <i class="ri-logout-circle-r-line"></i>[m
[31m-        Logout[m
[31m-      </div>[m
[31m-      <% } %>[m
[31m-      <!-- show only if user is logged out  -->[m
[32m+[m[32m    <!-- show only if user is logged in -->[m
[32m+[m[32m    <% if (currUser) { %>[m
[32m+[m[32m    <div class="link" id="logout-btn">[m
[32m+[m[32m      <i class="ri-logout-circle-r-line"></i>[m
[32m+[m[32m      Logout[m
[32m+[m[32m    </div>[m
[32m+[m[32m    <% } %>[m
[32m+[m[32m    <!-- show only if user is logged out  -->[m
 [m
[31m-      <% if (!currUser) { %>[m
[31m-      <div class="link" id="login-btn">[m
[31m-        <i class="ri-login-box-line"></i>[m
[31m-        Login[m
[31m-      </div>[m
[31m-      <div class="link" id="signup-btn">[m
[31m-        <i class="ri-registered-line"></i>[m
[31m-        Signup[m
[31m-      </div>[m
[31m-      <% } %>[m
[32m+[m[32m    <% if (!currUser) { %>[m
[32m+[m[32m    <div class="link" id="login-btn">[m
[32m+[m[32m      <i class="ri-login-box-line"></i>[m
[32m+[m[32m      Login[m
[32m+[m[32m    </div>[m
[32m+[m[32m    <div class="link" id="signup-btn">[m
[32m+[m[32m      <i class="ri-registered-line"></i>[m
[32m+[m[32m      Signup[m
     </div>[m
[32m+[m[32m    <% } %>[m
   </div>[m
 </div>[m
[1mdiff --git a/src/views/layouts/boilerplate.ejs b/src/views/layouts/boilerplate.ejs[m
[1mindex 6353761..ca6ffa0 100644[m
[1m--- a/src/views/layouts/boilerplate.ejs[m
[1m+++ b/src/views/layouts/boilerplate.ejs[m
[36m@@ -41,7 +41,8 @@[m
     <!-- main -->[m
     <div class="container">[m
       <%- include("../includes/dashboard.ejs") %>[m
[31m-      <main class="content">home</main>[m
[32m+[m[32m      <!-- body -->[m
[32m+[m[32m      <%- body %>[m
     </div>[m
 [m
     <!-- footer -->[m
[1mdiff --git a/src/views/products/index.ejs b/src/views/products/index.ejs[m
[1mindex da95a78..5d0c3f4 100644[m
[1m--- a/src/views/products/index.ejs[m
[1m+++ b/src/views/products/index.ejs[m
[36m@@ -1,40 +1,10 @@[m
 <% layout("layouts/boilerplate.ejs") %>[m
 <body>[m
[31m-  <div class="w-full h-full bg-zinc-900 p-10 text-white">[m
[31m-    <div class="nav mb-10">[m
[31m-      <a class="text-blue-500" href="/products/read">Read Users</a>[m
[31m-    </div>[m
[31m-    <h1 class="text-3xl tracking-tighter mb-3">Create User</h1>[m
[31m-    <form action="/products/create" method="post">[m
[31m-      <input[m
[31m-        class="px-5 py-2 bg-transparent border-2 border-zinc-800 rounded-lg outline-none"[m
[31m-        name="ProductName"[m
[31m-        type="text"[m
[31m-        placeholder="Product Name"[m
[31m-      />[m
[31m-      <input[m
[31m-        class="px-5 py-2 bg-transparent border-2 border-zinc-800 rounded-lg outline-none"[m
[31m-        name="ProductPrice"[m
[31m-        type="text"[m
[31m-        placeholder="Product Price"[m
[31m-      />[m
[31m-      <input[m
[31m-        class="px-5 py-2 bg-transparent border-2 border-zinc-800 rounded-lg outline-none"[m
[31m-        name="Description"[m
[31m-        type="text"[m
[31m-        placeholder="Discription"[m
[31m-      />[m
[31m-      <input[m
[31m-        class="px-5 py-2 bg-transparent border-2 border-zinc-800 rounded-lg outline-none"[m
[31m-        name="imgUrl"[m
[31m-        type="text"[m
[31m-        placeholder="image Url"[m
[31m-      />[m
[31m-      <input[m
[31m-        class="px-5 py-2 bg-blue-500 rounded-lg ml-3"[m
[31m-        type="submit"[m
[31m-        value="Create"[m
[31m-      />[m
[31m-    </form>[m
[31m-  </div>[m
[32m+[m[32m  <form action="/products/create" method="post">[m
[32m+[m[32m    <input name="ProductName" type="text" placeholder="Product Name" />[m
[32m+[m[32m    <input name="ProductPrice" type="text" placeholder="Product Price" />[m
[32m+[m[32m    <input name="Description" type="text" placeholder="Discription" />[m
[32m+[m[32m    <input name="imgUrl" type="text" placeholder="image Url" />[m
[32m+[m[32m    <input type="submit" value="Create" />[m
[32m+[m[32m  </form>[m
 </body>[m
[1mdiff --git a/src/views/products/read.ejs b/src/views/products/read.ejs[m
[1mindex 1819fe7..8e271ac 100644[m
[1m--- a/src/views/products/read.ejs[m
[1m+++ b/src/views/products/read.ejs[m
[36m@@ -1,47 +1,37 @@[m
[31m-<!DOCTYPE html>[m
[31m-<html lang="en">[m
[31m-  <head>[m
[31m-    <meta charset="UTF-8" />[m
[31m-    <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[31m-    <title>ProductSave</title>[m
[31m-[m
[31m-    <script src="https://cdn.tailwindcss.com"></script>[m
[31m-  </head>[m
[31m-[m
[31m-  <body>[m
[31m-    <div class="w-full h-100% bg-zinc-900 p-10 text-white">[m
[31m-      <div class="nav mb-5">[m
[31m-        <a class="text-blue-500" href="/products">Adding Product</a>[m
[31m-      </div>[m
[31m-      <h1 class="text-3xl tracking-tighter mb-3">All Products</h1>[m
[32m+[m[32m<% layout("layouts/boilerplate.ejs") %>[m
[32m+[m[32m<body>[m
[32m+[m[32m  <div class="w-full h-100% bg-zinc-900 p-10 text-white">[m
[32m+[m[32m    <div class="nav mb-5">[m
[32m+[m[32m      <a class="text-blue-500" href="/products">Adding Product</a>[m
[32m+[m[32m    </div>[m
[32m+[m[32m    <h1 class="text-3xl tracking-tighter mb-3">All Products</h1>[m
 [m
[31m-      <div class="users flex gap-3 flex-wrap">[m
[31m-        <% if(cafeproduct.length > 0) { %> <%[m
[31m-        cafeproduct.forEach(function(product){%>[m
[31m-        <div class="user w-72 p-4 bg-zinc-800 rounded-lg">[m
[31m-          <div class="w-full h-72 bg-zinc-700 rounded-lg overflow-hidden">[m
[31m-            <img[m
[31m-              class="w-full h-full object-cover object-top"[m
[31m-              src="<%=product.imgUrl  %>"[m
[31m-              alt=""[m
[31m-            />[m
[31m-          </div>[m
[31m-          <h3 class="text-2xl mt-2"><%= product.ProductName %></h3>[m
[31m-          <h3 class="text-xl mt-3"><%= product.ProductPrice %></h3>[m
[31m-          <h5 class="text-zinc-500"><%= product.Description%></h5>[m
[31m-          <div class="flex gap-3 mt-10">[m
[31m-            <a class="text-zinc-200" href="/products/edit/<%= product._id %>"[m
[31m-              >Edit Product</a[m
[31m-            >[m
[31m-            <a class="text-red-500" href="/products/delete/<%= product._id %>"[m
[31m-              >Delete Product</a[m
[31m-            >[m
[31m-          </div>[m
[32m+[m[32m    <div class="users flex gap-3 flex-wrap">[m
[32m+[m[32m      <% if(cafeproduct.length > 0) { %> <%[m
[32m+[m[32m      cafeproduct.forEach(function(product){%>[m
[32m+[m[32m      <div class="user w-72 p-4 bg-zinc-800 rounded-lg">[m
[32m+[m[32m        <div class="w-full h-72 bg-zinc-700 rounded-lg overflow-hidden">[m
[32m+[m[32m          <img[m
[32m+[m[32m            class="w-full h-full object-cover object-top"[m
[32m+[m[32m            src="<%=product.imgUrl  %>"[m
[32m+[m[32m            alt=""[m
[32m+[m[32m          />[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <h3 class="text-2xl mt-2"><%= product.ProductName %></h3>[m
[32m+[m[32m        <h3 class="text-xl mt-3"><%= product.ProductPrice %></h3>[m
[32m+[m[32m        <h5 class="text-zinc-500"><%= product.Description%></h5>[m
[32m+[m[32m        <div class="flex gap-3 mt-10">[m
[32m+[m[32m          <a class="text-zinc-200" href="/products/edit/<%= product._id %>"[m
[32m+[m[32m            >Edit Product</a[m
[32m+[m[32m          >[m
[32m+[m[32m          <a class="text-red-500" href="/products/delete/<%= product._id %>"[m
[32m+[m[32m            >Delete Product</a[m
[32m+[m[32m          >[m
         </div>[m
[31m-        <% }) %> <% } else{ %>[m
[31m-        <h3 class="text-zinc-500">No one Product here</h3>[m
[31m-        <% } %>[m
       </div>[m
[32m+[m[32m      <% }) %> <% } else{ %>[m
[32m+[m[32m      <h3 class="text-zinc-500">No one Product here</h3>[m
[32m+[m[32m      <% } %>[m
     </div>[m
[31m-  </body>[m
[31m-</html>[m
[32m+[m[32m  </div>[m
[32m+[m[32m</body>[m
