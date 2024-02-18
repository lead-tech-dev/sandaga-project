import {FunctionComponent, SetStateAction} from "react";
interface RulesProps {
    email: {
        err_mandatory: string;
        err_regexp: string;
        mandatory: boolean;
        regexp: string;
    },
    username: {
        err_mandatory: string;
        err_regexp: string;
        max_length: number;
        mandatory: boolean;
        regexp: string;
    },
    phone: {
        err_mandatory: string;
        err_regexp: string;
        mandatory: boolean;
        max_length: number,
        regexp: string;
    },
    password: {
        err_mandatory: string;
        err_regexp: string;
        mandatory: boolean;
        regexp: string;
    }
}
interface FormProps {
    username: string;
    email: string;
    password: string;
    phone: string;
}
interface RegexCheck {
    name: string;
    value: string;
    setFormData: SetStateAction<any>
    setFormErrRegexp: SetStateAction<any>
}

const rules: RulesProps = {
    email: {
        err_mandatory: "Veuillez insérer un email",
        err_regexp:
            "Vérifiez l'adresse email, son format n'est pas valide",
        mandatory: true,
        regexp: "^\\S+@\\S+\\.\\S+$",
    },
    username: {
        err_mandatory: "Veuillez insérer un nom",
        err_regexp: "Votre nom doit contenir au moins 2 caractères",
        mandatory: true,
        max_length: 20,
        regexp: "[^\\s].*[^\\s]",
    },
    password: {
        err_mandatory: "Veuillez insérer un mot de passe",
        err_regexp:
            "Minimum une minuscule, une majuscule, un nombre, 8 caractères",
        mandatory: true,
        regexp: "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})",
    },
    phone: {
        err_mandatory: "Veuillez insérer un numéro de téléphone",
        err_regexp:
            "Votre numéro de téléphone doit comporter 10 chiffres, sans espace ni séparateur",
        mandatory: true,
        max_length: 13,
        regexp: "^(\\d{10}|\\+\\d\\d\\|\\d{8,9})$",
    }
}

/*
export const RegexCheck: FunctionComponent<RegexCheck> = ({name, value, setFormData, setFormErrRegexp}) => {

    const regex = new RegExp(rules[name as keyof RulesProps].regexp);

    if (regex && regex.test(value)) {
        setFormErrRegexp((prevState: RulesProps) => ({...prevState, [name]: ""}));
        setFormData((prevState: FormProps) => ({...prevState, [name]: value}))
    } else {
        setFormErrRegexp((prevState: RulesProps) => ({...prevState, [name]: rules[name as keyof RulesProps].err_regexp}));

        setFormData((prevState: FormProps) => ({...prevState, [name]: value}))
    }
    return null;
}*/