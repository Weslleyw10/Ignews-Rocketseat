import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [ session ] = useSession()
    const router = useRouter()

    async function handleSubscribe() {
        // check if the user is already logged
        if(!session) {
            signIn('github')
            return;
        }

        if(session.activeSubscription) {
            router.push('/posts')
            return;
        }

        // create session checkout
        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data

            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({ sessionId })
            
        } catch (error) {
            console.log(error.message);
        }

    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
            // priceId={priceId}
        >
            Subscribe Now
        </button>
    )
}