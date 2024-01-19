let globalData; 

async function fetchData() {
    try {
        const response = await fetch('app.json');
        const data = await response.json();
        globalData = data;

        console.log(globalData);

        
        getPersonData();

    } catch (error) {
        console.error('Hiba történt:', error);
    }
}

fetchData();

function getPersonData() {
    document.getElementById('name').innerText = globalData.person['first_name'] + " " + globalData.person['last_name'];
    document.getElementById('lic_number').innerText = globalData.person['lic_number'];
    document.getElementById("last_payment").innerText = globalData.person.payments.payment_4.last_payment;
    document.getElementById("warranty_until").innerText = globalData.person.payments.payment_4.warranty_until;
}

window.addEventListener('resize', updateLayout);

updateLayout();

function updateLayout() {
    const screenWidth = window.innerWidth;

    if (globalData && globalData.person && globalData.person.payments) {
        clearPaymentContainer();

        if (screenWidth <= 376) {
            processPayments(globalData.person.payments, 'mobile');
        } else if (screenWidth >= 1000) {
            processPayments(globalData.person.payments, 'desktop');
        }
    }
}

document.addEventListener('DOMContentLoaded', updateLayout);
window.addEventListener('load', updateLayout);

function clearPaymentContainer() {
    const paymentContainer = document.getElementById('externalGridContainer');
    paymentContainer.innerHTML = '';
}



function processPayments(payments, viewType) {
    const paymentContainer = document.getElementById('externalGridContainer');

    for (const key in payments) {
        if (Object.hasOwnProperty.call(payments, key)) {
            const paymentData = payments[key];
            createPaymentElement(paymentData, paymentContainer, viewType);
        }
    }
}

function createPaymentElement(paymentData, container, viewType) {
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'payment';

    let paymentHTML = '';

    let statusImage = '';
    switch (paymentData.payment_status) {
        case 'Beérkezett':
            statusImage = 'img/dot-green.svg';
            break;
        case 'Sikertelen':
            statusImage = 'img/dot-red.svg';
            break;
        case 'Folyamatban':
            statusImage = 'img/dot-grey.svg';
            break;
        default:
            statusImage = 'img/default.svg';
    }

    let arrowImage = '';
    switch (paymentData.payment_method) {
        case 'Bankkártya':
            arrowImage = 'img/arrow-right.svg';
            break;
        case 'Átutalás':
            arrowImage = "";
            break;
        default:
            arrowImage = 'img/arrow-right.svg';
    }

    if (viewType === 'mobile') {
        paymentHTML = `
        <div class="payment_row mobile_row">
        <div class="mobile_wrapped">
            <img class="card_section_1" src="${statusImage}">
            <div class="resp_info card_section_2">
                <div class="mb-1">${paymentData.payment_status}</div>
                <div class="mb-1"><strong>${paymentData.booked_price} Ft</strong></div>
                <div class="joint_div">
                    <div>${paymentData.last_payment}</div>
                    <img src="img/joint.svg">
                </div>
            </div>
            <img class="rotated card_section_3" onclick="toggleInfo(event)" src="img/arrow-down.svg">
        </div>
        <div class="info more_info">
            <hr>
            <div class="card_hidden_body">
                <div class="card_hidden_section_1">
                    <div>
                        <p><small>Státusz</small></p>
                        <p>${paymentData.payment_status}</p>
                    </div>
                    <div>
                        <p><small>Azonosító</small></p>
                        <p>${paymentData.payment_ID}</p>
                    </div>
                    <div>
                        <p><small>Fizetés módja</small></p>
                        <p>${paymentData.payment_method}</p>
                    </div>
                </div>
                <hr>
                <div class="card_hidden_section_2">
                    <p><small>Csatolmány</small></p>
                    <div class="d-flex justify-content-between align-items-center       text-center">
                        <div class="d-flex align-items-center justify-content-center my-0">
                            <img src="img/pdf-icon.svg">
                                <a href="no-bill.html">Fizetési nyugta letöltése</a>
                        </div>
                        <img src="img/down_icon.svg">
                    </div>

                    
                </div>
                <hr>
                <div class="card_hidden_section_3">
                    <div>
                        <p><small>Időszak</small></p>
                        <p>${paymentData.warranty_length}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div>
                            <p><small>Díjelőírás</small></p>
                            <p>${paymentData.warranty_value}</p>
                        </div>
                        <div>
                            <p><small>Könyvelt díj</small></p>
                            <p>${paymentData.booked_price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>        `;
    } else {
        paymentHTML = `
        <div class='row payment_row my-3'> <!-- Belső grid -->
        <div class='col-2 show'><img src='${arrowImage}'>${paymentData.payment_ID}</div>
        <div class='col-2'>${paymentData.payment_method}</div>
        <div class='col-2'>${paymentData.last_payment}</div>
        <div class='col-2 value'>${paymentData.payment_sum} Ft</div>
        <div class='col-2 status'><img src="${statusImage}"> ${paymentData.payment_status}</div>
        <div class='col-1'><img src='img/joint.svg' alt='joint'></div>
        <div class='col-1'><img class='rotated' onclick="toggleInfo(event)" src='img/arrow-down.svg' alt='arrow-down'></div>
        
        <div class='info more_info'>
            <hr>
            <div class='row'>
                <div class='col-2 info_1'>
                    <p>Biztosítási időszak</p>
                    <p>${paymentData.warranty_length}</p>
                </div>
                <div class='col-2'></div>
                <div class='col-1 info_1'>
                    <p>Díjelőírás</p>
                    <p>${paymentData.warranty_value}</p>
                </div>
                <div class='col-3 info_1'>
                    <p>Könyvelt díj</p>
                    <p>${paymentData.booked_price}</p>
                </div>
            </div>
            <hr>
            <div class='row'>
                <div class='col-2'>
                    <p>Csatolmány</p>
                </div>
                <div class='joint_flex'>
                    <p><img src='img/pdf-icon.svg' alt='download bill'></p>
                    <p><a href="no_bill.html">Fizetési nyugta letöltése</a></p>
                </div>
            </div>
        </div>
    </div>
        `;


    }

    paymentDiv.innerHTML = paymentHTML;

    container.appendChild(paymentDiv);
}


function toggleInfo(event) {
    let clickedButton = event.target;
    let paymentRow = clickedButton.closest('.payment_row');
    let infoElement = paymentRow.querySelector('.more_info');
    let isActive = infoElement.classList.contains('active');
    infoElement.classList.toggle('active', !isActive);

    let arrowImage = paymentRow.querySelector('.rotated');

    if (isActive) {
        arrowImage.src = 'img/arrow-down.svg';
    } else {
        arrowImage.src = 'img/arrow-up.svg';
    }
}
