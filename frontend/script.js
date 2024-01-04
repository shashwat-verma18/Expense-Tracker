function submitForm(e) {

    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;


    var isPasswordMatch = password === confirmPassword;
    if(!isPasswordMatch){
        document.getElementById('passwordMain').innerText = '';
        document.getElementById('passwordError').innerText = 'Passwords do not match';
    }else
        document.getElementById('passwordError').innerText = '';


    if (isPasswordMatch) {

        var minLength = 8;
        var hasUppercase = /[A-Z]/.test(password);
        var hasLowercase = /[a-z]/.test(password);
        var hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

        console.log(password.length, hasLowercase, hasUppercase, hasUppercase);
        
        if(password.length < minLength)
            document.getElementById('passwordMain').innerText = 'Password should have 8 characters';

        else if(!hasUppercase)
            document.getElementById('passwordMain').innerText = 'Password should have atleast one uppercase character';

        else if(!hasLowercase)
            document.getElementById('passwordMain').innerText = 'Password should have atleast one lowercase character';

        else if(!hasSpecialCharacter)
            document.getElementById('passwordMain').innerText = 'Password should have atleast one special character';
    
        else
            alert("Name: " + name + "\nEmail: " + email + "\nPassword: " + password);
    }
}
