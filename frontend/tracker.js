const url = `http://localhost:4000`;

var leaderBoardStatus = false;

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
            history.replaceState(null, null, document.URL);
            window.location.replace("./dashboard.html");
        })
        .catch(err => console.log(err));

}


window.addEventListener("DOMContentLoaded", () => {
    let token = localStorage.getItem('token');
    if (!token) {
        window.location.replace("./login.html");
    }

    let decodeToken = parseJwt(token);

    if (decodeToken.isPremium) {
        showPremiumUser();
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

    loadLeaderboard();
});

function logOut() {
    localStorage.removeItem('token');
    history.replaceState(null, null, document.URL);
    window.location.replace("./login.html");
}

function deleteItem(e) {
    if (confirm('Are You Sure?')) {
        var li = e.target.parentElement;
        var liContent = li.textContent;
        const str = liContent.split("-");

        var key = str[3].trim();

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

                    showPremiumUser();
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

function showPremiumUser() {
    document.getElementById('premiumMsg').style.display = 'block';
    document.getElementById('leaderBoard').style.display = 'block';
    document.getElementById('premium').style.display = 'none';
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showLeaderboard(e) {

    if (!leaderBoardStatus) {

        document.getElementById('leaderBoard').innerHTML = 'Hide LeaderBoard';
        leaderBoardStatus = true;

        document.getElementById('leaderTitle').style.display = 'block';
        document.getElementById('listLeaderboard').style.display = 'block';

    } else {
        document.getElementById('leaderBoard').innerHTML = 'Show LeaderBoard';
        leaderBoardStatus = false;


        document.getElementById('leaderTitle').style.display = 'none';
        document.getElementById('listLeaderboard').style.display = 'none';
    }
}

function loadLeaderboard() {
    const token = localStorage.getItem('token');

    axios.get(`${url}/purchase/showLeaderboard`, { headers: { "Authorization": token } })
        .then(respond => {

            for (var i = 0; i < respond.data.userLeaderboard.length; i++) {
                showLeaderboardElement(respond.data.userLeaderboard[i]);
            }

        })
        .catch(err => console.log(err));
}

function showLeaderboardElement(obj) {

    console.log(obj);

    var name = obj.name;
    var amt = obj.total_amount;

    if(amt === null)
        amt = 0;

    var val1 = `Name : ${name}`;
    var val2 =`Total Expense : ₹${amt}`; 

    var list = document.getElementById('listLeaderboard');

    var li = document.createElement('li');

    var div1 = document.createElement('div');
    div1.style.float = 'left';
    div1.appendChild(document.createTextNode(val1));
    li.appendChild(div1);
    
    var div2 = document.createElement('div');
    div2.style.float = 'right';
    div2.appendChild(document.createTextNode(val2));
    li.appendChild(div2);
    
    li.style.padding = '3px';
    list.appendChild(li);

    var br = document.createElement('br');
    list.append(br);


}