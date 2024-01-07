const url = `http://localhost:4000`;

function addExpense(e) {

    e.preventDefault();

    var amount = document.getElementById('amt_inp').value;
    var des = document.getElementById('des').value;
    var cat = document.getElementById('cat-val').value;

    let obj = {
        amount,
        des,
        cat
    };

    let token = localStorage.getItem('token');

    axios.post(`${url}/expense/addExpense`, obj, { headers: { "Authorization": token } })
        .then(respond => {
            document.getElementById('myForm').reset();
        })
        .catch(err => console.log(err));

}

window.addEventListener("DOMContentLoaded", () => {
    let token = localStorage.getItem('token');
    if (!token) {
        window.location.replace("./login.html");
    }

    axios.get(`${url}/expense/getExpenses`, { headers: { "Authorization": token } })
        .then((respond) => {

            if (respond.data.expenses.length === 0) {
                document.getElementById('dashMsg').innerHTML = 'No data found !';
            } else {
                document.getElementById('dashMsg').innerHTML = '';
                for (var i = 0; i < respond.data.expenses.length; i++) {
                    showExpense(respond.data.expenses[i]);
                }
            }
        })
        .catch(err => console.log(err));
});

function logOut() {
    localStorage.removeItem('token');
    history.replaceState(null, null, document.URL);
    window.location.replace("./login.html");
}

function showExpense(obj) {

    var id = obj.id;
    var amount = obj.amount;
    var des = obj.description;
    var cat = obj.category;

    var val;

    if (des === '')
        val = '₹' + amount + ' - ' + cat;
    else
        val = '₹' + amount + ' - ' + des + ' - ' + cat;

    var list = document.getElementById('listExpenses');

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(val));

    var deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtn';
    deleteBtn.onclick = deleteItem;
    deleteBtn.appendChild(document.createTextNode('Delete'));
    li.appendChild(deleteBtn);


    var invDiv = document.createElement('div');
    invDiv.appendChild(document.createTextNode(`- ${id}`));
    invDiv.style.visibility = 'hidden';
    invDiv.style.float = 'right';
    invDiv.id = 'invTxt';
    li.appendChild(invDiv);

    li.style.padding = '10px';
    list.appendChild(li);

}

function deleteItem(e) {
    if (confirm('Are You Sure?')) {
        var li = e.target.parentElement;
        var liContent = li.innerText;
        const str = liContent.split("-");

        var key = document.getElementById('invTxt').textContent;
        key = key.replace("-", "");
        key = key.trim();

        let token = localStorage.getItem('token');

        axios.post(`${url}/expense/deleteExpense/${key}`, {}, { headers: { "Authorization": token } })
            .then((response) => {
                var list = document.getElementById('listExpenses');
                list.removeChild(li);
            })
            .catch(errorMessage => {
                console.log(errorMessage);
            });

    }
}

function premium(e) {
    let token = localStorage.getItem('token');

    axios.get(`${url}/purchase/premiumMembership`, { headers: { "Authorization": token } })
        .then(respond => {

            var options = {
                "key": respond.data.key_id,
                "order_id": respond.data.order.id,
                "handler": async function (respond) {
                    await axios.post(`${url}/purchase/updateTransactionStatus`, {
                        order_id: options.order_id,
                        payment_id: respond.razorpay_payment_id,
                        check: true
                    }, { headers: { "Authorization": token } });

                    alert('You are a Premium User Now');
                },
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();

            rzp1.on('payment.failed', async function (respond) {

                await axios.post(`${url}/purchase/updateTransactionStatus`, {
                    order_id: respond.error.metadata.order_id,
                    payment_id: respond.error.metadata.payment_id,
                    check: false
                }, { headers: { "Authorization": token } });

                alert('Transaction Failed');
            })
        })
        .catch(err => console.log(err));

}