import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { Elements, StripeProvider } from "react-stripe-elements";

import { onError } from "../../libs/error";
import config from "../../config";
import BillingForm from "../../components/BillingForm/BillingForm";
import "./Settings.css";

export default function Settings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    console.log("Stripe Key: ", config.STRIPE_KEY);
    setStripe((window as any).Stripe(config.STRIPE_KEY));
  }, []);

  function billUser(details: any) {
    return API.post("branches", "/billing", {
      body: details,
    });
  }

  async function handleFormSubmit(storage: number, data: any) {
    const { token, error } = data;
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully!");
      history.push("/dashboard");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Settings">
      <StripeProvider stripe={stripe}>
        <Elements>
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}
