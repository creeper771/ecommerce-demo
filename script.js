// --- Funcionalidad Común ---

// Recuperar el contador del carrito (ficticio) usando sessionStorage para persistir entre páginas
let cartCount = sessionStorage.getItem('cartCount') ? parseInt(sessionStorage.getItem('cartCount')) : 0;

function updateCartCounterDisplay() {
    const counterElements = document.querySelectorAll('.cart-counter');
    counterElements.forEach(el => {
        el.textContent = cartCount;
    });
}

// Inicializar el contador en la carga
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounterDisplay();
});

// Función para mostrar notificación toast
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// --- 2. Registro ---
const registroForm = document.getElementById('registro-form');
if (registroForm) {
    const terminosCheckbox = document.getElementById('terminos');
    const submitBtn = document.getElementById('submit-btn');
    const inputs = registroForm.querySelectorAll('input:not([type="checkbox"])');
    const formMessage = document.getElementById('form-message');

    // Habilitar botón solo si se aceptan los términos
    terminosCheckbox.addEventListener('change', (e) => {
        submitBtn.disabled = !e.target.checked;
    });

    // Validar al enviar
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga

        // Verificar que todos los campos estén completos (ya que no se usa required)
        let todosCompletos = true;
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                todosCompletos = false;
            }
        });

        if (!todosCompletos) {
            formMessage.textContent = 'Error: Por favor, complete todos los campos.';
            formMessage.className = 'form-message error';
            return;
        }

        // Validación extra de email (por si el HTML5 pattern falla)
        const emailInput = document.getElementById('email').value;
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(emailInput)) {
            formMessage.textContent = 'Error: El formato del correo electrónico no es válido.';
            formMessage.className = 'form-message error';
            return;
        }

        formMessage.textContent = '¡Registro exitoso!';
        formMessage.className = 'form-message success';
        registroForm.reset();
        submitBtn.disabled = true;
    });
}


// --- 3. Quiénes somos ---
const btnVerMas = document.getElementById('btn-ver-mas');
const extraInfo = document.getElementById('extra-info');

if (btnVerMas && extraInfo) {
    btnVerMas.addEventListener('click', () => {
        const isVisible = extraInfo.classList.toggle('visible');
        if (isVisible) {
            btnVerMas.textContent = 'Ocultar información';
        } else {
            btnVerMas.textContent = 'Ver más información';
        }
    });
}


// --- 4. Catálogo ---
const btnsAddToCart = document.querySelectorAll('.add-to-cart-btn');
if (btnsAddToCart.length > 0) {
    btnsAddToCart.forEach(btn => {
        btn.addEventListener('click', () => {
            // Incrementar contador ficticio
            cartCount++;
            sessionStorage.setItem('cartCount', cartCount);
            updateCartCounterDisplay();

            // Mostrar mensaje
            showToast('Producto agregado al carrito');
        });
    });
}


// --- 5. Carrito de compra ---
const qtyInputs = document.querySelectorAll('.qty-input');
const totalAmmountElement = document.getElementById('total-amount');

if (qtyInputs.length > 0 && totalAmmountElement) {

    // Validar que solo se ingresen números y actualizar total
    qtyInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // Eliminar caracteres no numéricos
            let val = e.target.value;
            val = val.replace(/[^0-9]/g, '');
            e.target.value = val;

            recalcularTotal();
        });

        // Manejar caso donde queda vacío
        input.addEventListener('blur', (e) => {
            if (e.target.value === '' || parseInt(e.target.value) < 0) {
                e.target.value = '1';
                recalcularTotal();
            }
        });
    });

    function recalcularTotal() {
        let total = 0;
        const cartItems = document.querySelectorAll('.cart-item');

        cartItems.forEach(item => {
            const priceText = item.querySelector('.cart-item-price').dataset.price;
            const qty = item.querySelector('.qty-input').value;

            const price = parseFloat(priceText);
            const quantity = parseInt(qty) || 0; // fallback a 0 si está vacío

            total += price * quantity;
        });

        totalAmmountElement.textContent = '$' + total.toFixed(2);
    }
}


// --- 6. Búsqueda de productos ---
const searchForm = document.getElementById('search-form');
if (searchForm) {
    const searchInput = document.getElementById('search-input');
    const searchMessage = document.getElementById('search-message');
    const fakeProducts = document.getElementById('fake-products');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const term = searchInput.value.trim();

        if (term !== '') {
            searchMessage.textContent = `Resultados para la búsqueda de "${term}"`;
            fakeProducts.classList.add('visible'); // Mostrar los productos ficticios usando clase CSS
        } else {
            searchMessage.textContent = 'Por favor, ingrese un término de búsqueda.';
            fakeProducts.classList.remove('visible');
        }
    });
}
