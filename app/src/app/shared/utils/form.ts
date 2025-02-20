import { FormGroup } from "@angular/forms"

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