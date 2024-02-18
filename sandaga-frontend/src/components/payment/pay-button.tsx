import React, {FunctionComponent} from 'react';

interface PayButtonProps {
    errors: any;
    selectedRelay: boolean;
    delivery_mode: string;
    creditCardData: any;
    handleSubmit: (e: any) => void;
    loading: boolean;
    resError: string | null;
}
const PayButton: FunctionComponent<PayButtonProps> = ({resError, loading, handleSubmit, creditCardData, errors, selectedRelay, delivery_mode}) => {
    return (
        <>
            {resError ? (
                <p>{resError}</p>
            ): (
                <p className="indication">Vous ne serez débité que lorsque le vendeur aura confirmé la disponibilité de la commande.</p>
            )}
            <div className="col-12 col-md-3 mt-5">
                <div className="text-center">
                    <button
                        onClick={(e) =>  handleSubmit(e)}
                        type="submit"
                        className="btn btn-primary full-width"
                        disabled={errors && (errors["firstName"] ||
                            errors["lastName"] ||
                            errors["phone"] ||
                            errors["pincode"] ||
                            errors["city"] ||
                            errors["address"] ||
                            errors["country"]) ? true : delivery_mode === "mondial-relay" && !selectedRelay  ? true :  !(creditCardData && creditCardData.complete)
                    }
                    >
                        {loading ? (
                            <div className="spinner-border text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ): "Payer"}
                    </button>

                </div>
            </div>
        </>
    );
};

export default PayButton;