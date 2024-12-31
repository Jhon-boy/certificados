
const Utils = (() => {
     /***
      * Metodo que crea un Loader que se muestra en cada peticion HTTP 
      */
    const createLoader = () => {
        const loaderHTML = `
        <div id="globalLoader" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1050; align-items: center; justify-content: center;">
            <img src="../img/loader.gif" alt="Cargando..." style="width: 100px; height: 100px;">
        </div>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = loaderHTML.trim();
        document.body.appendChild(tempDiv.firstChild);
    };

    const showLoader = () => {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.style.display = 'flex';
    };

    const hideLoader = () => {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.style.display = 'none';
    };

    /**
     * Metodo que crea un modal si la peticion HTTP fue un ERROR 
     * @param {any} messageClient
     * @param {any} messageTech
     */
    const createErrorModal = (messageClient, messageTech) => {
        const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalLabel">Error</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Mensaje: </strong>${messageClient}</p>
                        ${messageTech ? `<p><strong>Detalle técnico: </strong>${messageTech}</p>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML.trim();
        document.body.appendChild(tempDiv.firstChild);
    };
    const showErrorModal = (messageClient, messageTech) => {
        createErrorModal(messageClient, messageTech);
        const modal = new bootstrap.Modal(document.getElementById('errorModal'));
        modal.show();
    };

    const createSuccessRequest = () => {
        const alertHtml = `
            <div class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        OPERACIÓN REALIZADA CON ÉXITO.
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`;
        const tempDivSuccess = document.createElement('div');
        tempDivSuccess.innerHTML = alertHtml.trim();
        document.body.appendChild(tempDivSuccess);

        const toast = new bootstrap.Toast(tempDivSuccess.firstChild);
        toast.show();

        tempDivSuccess.firstChild.addEventListener('hidden.bs.toast', () => {
            tempDivSuccess.remove();
        });
    };
    /**
     * METODO QUE REALIZA PETICIONES HTTP
     * @param {any} url
     * @param {any} options
     * @returns
     */
    const httpRequest = async (url, options = {}, showAlert = true) => {
        showLoader();  
        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (result.cod === Utils.COD_OK) {
                if (showAlert) createSuccessRequest();
                return result;
            } else {
                const messageClient = result.message || "Ocurrió un error inesperado.";
                const messageTech = result.data || null;
                showErrorModal(messageClient, messageTech);
                throw new Error(messageClient);
            }
        } catch (error) {
            const messageClient = "Error en la peticion";
            const messageTech = error;
            showErrorModal(messageClient, messageTech);
            throw error;
        } finally {
            setTimeout(() => {
                hideLoader();  
            }, 2000)
          
        }
    };
    /**
     * Metodo que muestra la Notificacion 
     * @param {any} message
     * @param {any} type
     */
    const showToast = (message, type = 'primary') => {
        const toastContainerId = "toastContainer";
        let toastContainer = document.getElementById(toastContainerId);
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = toastContainerId;
            toastContainer.style.position = "fixed";
            toastContainer.style.bottom = "20px";
            toastContainer.style.left = "50%";
            toastContainer.style.transform = "translateX(-50%)";
            toastContainer.style.zIndex = "1060";
            toastContainer.style.width = "fit-content";
            document.body.appendChild(toastContainer);
        }

        const toastHtml = `
        <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true"  style="width: 480px; height:65px; font-size: 1.2rem; padding: 20px;"> 
              <div class="d-flex">
               <center >
                     <div class="toast-body">
                    ${message}
                     </div>
                </center>  
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = toastHtml.trim();
        const toastElement = tempDiv.firstChild;
        toastContainer.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        toastElement.addEventListener("hidden.bs.toast", () => {
            toastElement.remove();
        });
    };
    const path = 'api';
    const COD_OK = 'OK';
    //Limpia el LocalStorage
    const limpiarLocalStorage = () => { 
        localStorage.clear();
    }
    //Limpia la navegacion 
    const cleanRoute = () => {
        history.replaceState(null, null, '/');
        history.pushState(null, null, '/');
    }
    //Vuelve al Inicio 
    const backToIndex = () => {
        cleanRoute();
        window.location.href = "/Home/Index";
        window.location.reload(true);  
    }

    createLoader(); // Crea el loader al inicializar

    return {
        httpRequest,
        path,
        COD_OK,
        showToast,
        limpiarLocalStorage,
        backToIndex,
        cleanRoute
 
    };
})();
