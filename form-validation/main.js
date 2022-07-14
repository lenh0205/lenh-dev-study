function Validator(options) {
    var formElement = document.querySelector(options.form)
    if (!formElement) return

    var selectorRules = {}

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        var rules = selectorRules[rule.selector]
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        
        return !!errorMessage
    }

    options.rules.forEach(rule => {
        if (selectorRules[rule.selector]) {
            selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector] = [rule.test]
        }

        var inputElements = formElement.querySelectorAll(rule.selector)
        Array.from(inputElements).forEach(inputElement => {
            inputElement.onblur = () => {
                validate(inputElement, rule)
                // với mỗi input sẽ gọi 1 lần validate() -> khi 2 rule có cùng 1 selector -> console.log() trong validate() sẽ in 2 lần kết quả
            }
            inputElement.oninput = () => {
                var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                errorElement.innerText = ''
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            }
        })
    })

    formElement.onsubmit = (e) => {
        if (typeof options.onSubmit !== 'function') return;
        e.preventDefault()
        var isValid

        // Validate
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            isValid = !validate(inputElement, rule)
        })

        // Gửi data
        if (isValid) {
            enableInputs = formElement.querySelectorAll('[name]:not(:disabled)')
            let formValues = Array.from(enableInputs).reduce((values, input) => {
                switch (input.type) {
                    case 'radio':
                    case 'checkbox':
                        // if (!input.matches(':checked')) return values
                        // if (values[input.name]) {
                        //     values[input.name].push(input.value)
                        // } else {
                        //     values[input.name] = [input.value]
                        // }
                        var checkedList = formElement.querySelectorAll(`input[name=${input.name}]:checked`)
                        values[input.name] = Array.from(checkedList).reduce((acc, input) => {
                            return acc.concat(input.value)
                        }, [])
                        break
                    case 'file':
                        values[input.name] = input.files
                        break;
                    default:
                        values[input.name] = input.value
                }
                return values
            }, {})

            options.onSubmit(formValues)
        }
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là Email'
        }
    }
}
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test(value) {
            return value >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function (selector, getComfirmValue, message) {
    return {
        selector: selector,
        test(value) {
            return value == getComfirmValue() ? undefined : message || 'Mật khẩu xác nhận lại không đúng'
        }
    }
}

// var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
// return regex.test(value) ? undefined : message || 'Trường này phải là Email'