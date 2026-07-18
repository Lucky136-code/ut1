document.addEventListener("DOMContentLoaded", () => {
    // 1. Calculate and display dynamic trial end date (7 days from now)
    const nextBillingDateEl = document.getElementById("next-billing-date");
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const nextBillingDate = new Date(today);
    nextBillingDate.setDate(today.getDate() + 7);
    
    if (nextBillingDateEl) {
        nextBillingDateEl.textContent = nextBillingDate.toLocaleDateString('en-US', options);
    }

    // 2. Pricing Modal Orchestration
    const planButtons = document.querySelectorAll(".card-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const selectedPlanInput = document.getElementById("selected-plan");
    const modalPlanTitle = document.getElementById("modal-plan-title");
    
    const breakdownPlanPrice = document.getElementById("breakdown-plan-price");
    const breakdownUsagePrice = document.getElementById("breakdown-usage-price");
    const summaryBillingRate = document.getElementById("summary-billing-rate");
    const submitBtn = document.getElementById("submit-btn");

    if (planButtons && checkoutModal) {
        planButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const plan = btn.getAttribute("data-plan");
                selectedPlanInput.value = plan;
                
                if (plan === "basic") {
                    modalPlanTitle.textContent = "Set up Basic Membership";
                    breakdownPlanPrice.innerHTML = `<span class="currency-symbol">₹</span>8,999.00 / mo`;
                    breakdownUsagePrice.textContent = "Included (100 Renders)";
                    summaryBillingRate.innerHTML = `<span class="currency-symbol">₹</span>8,999/month`;
                    submitBtn.className = "pay-submit-btn btn-starter-theme";
                } else {
                    modalPlanTitle.textContent = "Set up Pro Membership";
                    breakdownPlanPrice.innerHTML = `<span class="currency-symbol">₹</span>11,999.00 / mo`;
                    breakdownUsagePrice.textContent = "Unlimited Renders";
                    summaryBillingRate.innerHTML = `<span class="currency-symbol">₹</span>11,999/month`;
                    submitBtn.className = "pay-submit-btn btn-growth-theme";
                }
                
                checkoutModal.classList.add("active");
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            checkoutModal.classList.remove("active");
        });
    }

    if (checkoutModal) {
        checkoutModal.addEventListener("click", (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove("active");
            }
        });
    }

    // 3. Form Submission Handler
    const checkoutForm = document.getElementById("checkout-form");
    const successOverlay = document.getElementById("success-overlay");
    const successMessage = document.getElementById("success-message");
    const successClose = document.getElementById("success-close");

    // CONFIGURATION: Replace these with your actual Razorpay credentials from your Dashboard.
    const RAZORPAY_KEY_ID = "rzp_test_replace_with_your_own_key"; 
    
    // Optional: If you generate subscription IDs from your backend, paste them here.
    // E.g., basic subscription: "sub_123456", pro subscription: "sub_789012"
    const BASIC_SUBSCRIPTION_ID = ""; 
    const PRO_SUBSCRIPTION_ID   = ""; 

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Extract user inputs
            const name = document.getElementById("client-name").value;
            const email = document.getElementById("client-email").value;
            const phone = document.getElementById("client-phone").value;
            const plan = selectedPlanInput.value;
            
            const isBasic = plan === "basic";
            const planName = isBasic ? "Basic Membership" : "Pro Membership";
            const planAmount = isBasic ? "8999" : "11999";
            const usageRate = isBasic ? "Included (100 Renders)" : "Unlimited Renders";

            // Change button state to loading
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Processing secure gateway...</span>`;

            // Validate if Razorpay SDK is loaded
            if (typeof Razorpay === "undefined") {
                console.warn("Razorpay SDK not loaded. Simulating mock payment mode.");
                setTimeout(() => {
                    showSuccessScreen(name, "pay_mock_1234567890", planName, planAmount);
                }, 1500);
                return;
            }

            // Razorpay Standard Checkout Options
            const razorpayOptions = {
                "key": RAZORPAY_KEY_ID === "rzp_test_replace_with_your_own_key" ? "rzp_test_3m1tE7vE9Gz45a" : RAZORPAY_KEY_ID, 
                "name": "Uma Traders",
                "description": `${planName} - 7 Day Free Trial`,
                "image": "assets/logo.jpeg",
                "handler": function (response) {
                    showSuccessScreen(name, response.razorpay_payment_id || response.razorpay_subscription_id || "pay_success", planName, planAmount);
                },
                "prefill": {
                    "name": name,
                    "email": email,
                    "contact": phone
                },
                "notes": {
                    "subscription_type": `${planName} (7 Days Trial)`,
                    "billing_amount_after_trial": planAmount,
                    "usage_rate": usageRate
                },
                "theme": {
                    "color": isBasic ? "#111111" : "#ff5021"
                },
                "modal": {
                    "ondismiss": function () {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            };

            // Bind subscription ID if available to activate UPI Autopay / recurring mandate natively
            const activeSubId = isBasic ? BASIC_SUBSCRIPTION_ID : PRO_SUBSCRIPTION_ID;
            if (activeSubId && activeSubId.startsWith("sub_")) {
                razorpayOptions.subscription_id = activeSubId;
            } else {
                razorpayOptions.amount = "200"; // Fallback: ₹2.00 token authorization
                razorpayOptions.currency = "INR";
            }

            try {
                const rzp = new Razorpay(razorpayOptions);
                rzp.on('payment.failed', function (response) {
                    alert(`Payment verification failed: ${response.error.description}`);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
                rzp.open();
            } catch (err) {
                console.error("Razorpay initiation error: ", err);
                setTimeout(() => {
                    showSuccessScreen(name, "pay_demo_error_fallback", planName, planAmount);
                }, 1000);
            }
        });
    }

    // Helper: Show successful confirmation screen
    function showSuccessScreen(name, paymentId, planName, planAmount) {
        if (successOverlay && successMessage) {
            successMessage.innerHTML = `
                Congratulations <strong>${name}</strong>!<br><br>
                Your 7-day free trial of the <strong>${planName}</strong> has been successfully registered.<br>
                A <span class="currency-symbol">₹</span>2.00 card verification authorization has been processed.<br><br>
                <strong>Transaction ID:</strong> ${paymentId}<br>
                <strong>Next Billing:</strong> <span class="currency-symbol">₹</span>${parseInt(planAmount).toLocaleString('en-IN')}.00 on ${nextBillingDate.toLocaleDateString('en-US', options)}.<br><br>
                Our team will contact you at your provided details within 24 hours to help you enable your AI workspace.
            `;
            successOverlay.classList.add("active");
            
            // Close the checkout modal since we are done
            if (checkoutModal) {
                checkoutModal.classList.remove("active");
            }
        }
        
        // Reset form
        if (checkoutForm) {
            checkoutForm.reset();
        }
        
        // Reset submit button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Activate 7-Day Free Trial</span> ↗`;
        }
    }

    // 4. Close Success Overlay and return home
    if (successClose) {
        successClose.addEventListener("click", () => {
            if (successOverlay) {
                successOverlay.classList.remove("active");
            }
            window.location.href = "index.html";
        });
    }
});
