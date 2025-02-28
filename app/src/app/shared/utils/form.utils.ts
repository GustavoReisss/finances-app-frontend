import { FormControl, FormGroup, Validators } from "@angular/forms"

export const markAsDirtAndTouched = (fg: FormGroup) => {
    for (let control of Object.values(fg.controls)) {
        if (control instanceof FormGroup) {
            markAsDirtAndTouched(control)
            continue
        }

        control.markAsDirty()
        control.markAllAsTouched()
    }
}

export const addControls = (fg: FormGroup, newControls: { [key: string]: any }) => {
    Object.entries(newControls).forEach(([controlName, initialValue]) => {
        let control = (initialValue instanceof FormGroup) ? initialValue : new FormControl(initialValue, [Validators.required])
        fg.addControl(controlName, control)
    })
}

export const removeAllControls = (fg: FormGroup) => {
    Object.keys(fg.controls).forEach(controlKey => fg.removeControl(controlKey))
}


export const removeControls = (fg: FormGroup, controls: string[]) => {
    controls.forEach(control => fg.removeControl(control))
}