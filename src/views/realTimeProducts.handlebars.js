<h1 class="text-center">Productos en tiempo real</h1>
<div class="container mt-5">
    <div class="row">
        <div class="col-md-6 offset-md-3">
        <form action="/addProduct" method="POST" id="addProductForm" enctype="multipart/form-data">
                <div class="mb-3">
                    <input type="text" class="form-control" name="title" id="title" placeholder="Título" required>
                </div>
                <div class="mb-3">
                    <input type="text" class="form-control" name="brand" id="brand" placeholder="Marca" required>
                </div>
                <div class="mb-3">
                    <textarea class="form-control" name="description" id="description" placeholder="Descripción"
                        required></textarea>
                </div>
                <div class="mb-3">
                    <input type="number" class="form-control" name="price" id="price" placeholder="Precio" required>
                </div>
                <div class="mb-3">
                    <input type="number" class="form-control" name="stock" id="stock" placeholder="Stock" required>
                </div>
                <div class="mb-3"></div>

                <select class="form-select" name="category" id="category" required>
                        <option value="" disabled selected>Seleccione una categoría</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="libros">Libros</option>
                        <option value="ropa">Ropa</option>
                    </select>
                </div>
                <div class="mb-3">
                    <input type="file" class="form-control" name="image" id="image" accept="image/*" required>
                </div>
                <div class="mb-3">
                    <button type="submit" class="btn btn-primary">Agregar Producto</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="container mt-5">
    <div class="row" id="productList">
        {{#each products}}
        <div class="col-md-4 mb-4">
            <div class="card">              

            <img src="/img/{{this.image}}" class="card-img-top img-fluid" alt="{{this.title}}"
                    style="max-height: 400px; aspect-ratio: 3/2; object-fit: contain;">
                <div class="card-body"></div>

                <h5 class="card-title">{{this.title}}</h5>
                    <p class="card-text">{{this.brand}}</p>
                    <p class="card-text">{{this.description}}</p>
                    <p class="card-text">Precio: ${{this.price}}</p>
                    <p class="card-text">Stock: {{this.stock}}</p>
                    <p class="card-text">Categoría: {{this.category}}</p>
                    <button class="btn btn-danger delete-btn" data-product-id="{{this._id}}">Eliminar Producto</button>
                </div>
            </div>
        </div>
        {{/each}}
    </div>
</div>
              


<script src="/socket.io/socket.io.js"></script>

<script type="module" src="/js/realTimeProducts.js"></script>

