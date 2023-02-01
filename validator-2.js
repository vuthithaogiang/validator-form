



function Validator(formSelector) {

    var _this = this;
    console.log(_this);
    
    function getParent(element, selector) {

        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {

                return element.parentElement;
            }

            element = element.parentElement;

        }

    }

    var formRules = {};
    /**
     * qui uoc rules:
     * - neu co error: return message
     * - neu khong co error: return `undefined`
     */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Can not be blank!';

        },

        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please enter email!';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Please enter least ${min} characters! `;
            };

        },

        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Please enter maximun ${max} charcters!`;
            };
        }

    };

    // lay ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector);

    //chi xu li khi co element trong DOM
    if (formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]');
        console.log(inputs);



        for (var input of inputs) {
            // console.log(input.name);
            // console.log(input.getAttribute('rules'));

            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {

                var ruleInfo;

                var isRuleHasValue = rule.includes(':');

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];

                    //ruleInfo[1]
                }

                // console.log(rule);

                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }
                else {
                    formRules[input.name] = [ruleFunc];

                }

            }

            // formRules[input.name] =  input.getAttribute('rules');

            // listent event: blur, oninput, 

            input.onblur = handleValidate;

            input.oninput = handleClearError;
        }

        console.log(formRules);

        function handleValidate(event) {
            var rules = formRules[event.target.name];

            var errorMessage;

            for( var rule of rules) {
                errorMessage = rule(event.target.value);
                if(errorMessage) break;


            }
            
            console.log(errorMessage);

            //xu li loi: hien thi ra UI
            if (errorMessage) {
                console.log(event.target);

                var formGroup = getParent(event.target, ".form-group");
                console.log(formGroup);

                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');

                    if (formMessage) {
                        formMessage.innerText = errorMessage;

                    }
                }

            }
            return !errorMessage;

        }

        function handleClearError(event) {

            var formGroup = getParent(event.target, ".form-group");

            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                formGroup.querySelector('.form-message').innerText = '';
            }

        }


    }

   // console.log(this);

    // xu li hanh vi mac dinh submit form

    formElement.onsubmit = function (e){
        e.preventDefault();

        
        var inputs = formElement.querySelectorAll('[name][rules]');

        var isFormValid = true;

        for( var input of inputs) {
           
            if(!handleValidate({target: input})){
                isFormValid = false;
            }
            
        }

        console.log(isFormValid);

        //khi ko loi
        if(isFormValid) {
            console.log(_this);
            if(typeof _this.onSubmit === 'function'){
            
                var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                var formValues = Array.from(enableInputs).reduce(function (values, input) {

                    switch (input.type) {
                        case 'radio':

                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;

                        case 'checkbox':
                            if(!input.matches(':checked')) return values;

                        
                            if(!Array.isArray(values[input.name]) ) {
                                values[input.name] = [];
                            }


                            // luon luon la array

                            values[input.name].push(input.value);
                            break;

                        case 'file':
                            values[input.name] = input.files;
                            break;

                        default:
                            values[input.name] = input.value;

                    }

                    return values;

                }, {});


                _this.onSubmit(formValues);

            }
            else{
                formElement.submit();

            }
        }
    }
}

/*
Validator('#register-form', {
    onSubmit: function (data){

        
        console.log('call API');
        console.log(data);

    }
});

*/

// Constructor
var form = new Validator('#register-form');

form.onSubmit = function (formData){
    console.log(formData);
}