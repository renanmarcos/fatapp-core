'use strict';

export class ValidationContract {
    _errors: any
    constructor() {
        this._errors = [];
    }
    isNotArrayOrEmpty(value: any, message: any) {
        if (!value && value.length == 0)
            this._errors.push({ message: message });
    }
    isTrue(value: any, message: any) {
        if (value)
            this._errors.push({ message: message });
    }

    isRequired(value: any, message: any) {
        if (!value || value.length <= 0)
            this._errors.push({ message: message });
    }

    hasMinLen(value: any, min: any, message: any) {
        if (!value || value.length < min)
            this._errors.push({ message: message });
    }

    hasMaxLen(value: any, max: any, message: any) {
        if (!value || value.length > max)
            this._errors.push({ message: message });
    }

    isFixedLen(value: any, len: any, message: any) {
        if (value.length != len)
            this._errors.push({ message: message });
    }

    isEmail(value: any, message: any) {
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value))
            this._errors.push({ message: message });
    }

    errors() {
        return this._errors;
    }

    clear() {
        this._errors = [];
    }

    isValid() {
        return this._errors.length == 0;
    }
}

export default ValidationContract;    
