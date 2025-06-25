const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { 
      price_data, 
      quantity = 1, 
      success_url, 
      cancel_url,
      customer_email,
      metadata = {}
    } = req.body;

    if (!price_data || !success_url || !cancel_url) {
      return res.status(400).json({
        error: 'price_data, success_url et cancel_url sont requis'
      });
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: price_data.currency || 'eur',
            product_data: {
              name: price_data.product_name,
              description: price_data.description,
              images: price_data.images || []
            },
            unit_amount: price_data.unit_amount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: metadata
    };

    if (customer_email) {
      sessionConfig.customer_email = customer_email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ 
      id: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
};

exports.getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de la session',
      details: error.message 
    });
  }
};