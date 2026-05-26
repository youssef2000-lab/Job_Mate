import { createSlice } from '@reduxjs/toolkit';

const defaultReviews = [
  {
    id: 2001,
    providerId: 'static-1',
    creatorName: 'Amine K.',
    rating: 5,
    comment: 'Ponctuel et très professionnel. Il a réparé ma fuite en un rien de temps ! Je recommande chaudement.',
    date: 'Hier'
  },
  {
    id: 2002,
    providerId: 'static-1',
    creatorName: 'Sami L.',
    rating: 5,
    comment: 'Service impeccable, Marc est très à l\'écoute et son travail est soigné.',
    date: 'Il y a 3 jours'
  },
  {
    id: 2003,
    providerId: 'static-2',
    creatorName: 'Julie D.',
    rating: 5,
    comment: 'Sophie a transformé mon salon ! Ses idées de design sont géniales et elle respecte le budget.',
    date: 'Lundi'
  },
  {
    id: 2004,
    providerId: 'static-2',
    creatorName: 'Karim O.',
    rating: 4,
    comment: 'Très créative et à l\'écoute. Le rendu final est superbe.',
    date: 'Il y a une semaine'
  },
  {
    id: 2005,
    providerId: 'static-3',
    creatorName: 'Nicolas R.',
    rating: 5,
    comment: 'Électricien très compétent. Il a installé ma borne de recharge rapidement et proprement.',
    date: 'Hier à 14h'
  },
  {
    id: 2006,
    providerId: 'static-3',
    creatorName: 'Fatima S.',
    rating: 5,
    comment: 'Thomas est intervenu en urgence pour un court-circuit. Très rassurant et efficace.',
    date: 'Il y a 2 jours'
  }
];

const initialState = {
  reviews: [...defaultReviews, ...(JSON.parse(localStorage.getItem('jobmate_v3_reviews')) || [])],
};

// Function to calculate average rating for a provider
const calculateAverageRating = (providerId, reviews) => {
  const providerReviews = reviews.filter(review => review.providerId === providerId);
  if (providerReviews.length === 0) return 0;
  
  const sum = providerReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / providerReviews.length).toFixed(1);
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action) => {
      // action.payload: { providerId, creatorName, rating, comment, date }
      state.reviews.push({
        ...action.payload,
        id: Date.now(),
      });
      localStorage.setItem('jobmate_v3_reviews', JSON.stringify(state.reviews));
    },
  },
});

export const { addReview } = reviewSlice.actions;
export { calculateAverageRating };
export default reviewSlice.reducer;
