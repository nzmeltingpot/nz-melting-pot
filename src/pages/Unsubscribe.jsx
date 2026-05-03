import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import usePageMeta from '../hooks/usePageMeta';
import { sendUnsubscribeConfirmationEmail } from '../utils/emailTemplates';

const MEMBERS_TABLE_ID = 79993;

export default function Unsubscribe() {
  useScrollReveal();
  usePageMeta({
    title: 'Unsubscribe — NZ Melting Pot',
    description: 'Unsubscribe from our newsletter.',
    path: '/unsubscribe'
  });

  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [status, setStatus] = useState('idle'); // idle | loading | success | error | not-found | already-unsubscribed
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setErrorMessage('No email address provided.');
      return;
    }

    setStatus('loading');

    try {
      // Find the member by email
      const { data, error: fetchError } = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [
        { name: 'email', op: 'Equal', value: email }]

      });

      if (fetchError) {
        throw new Error(fetchError);
      }

      if (!data?.List || data.List.length === 0) {
        setStatus('not-found');
        return;
      }

      const member = data.List[0];

      // Check if already unsubscribed
      if (member.status === 'unsubscribed') {
        setStatus('already-unsubscribed');
        return;
      }

      // Update the member status to unsubscribed
      const today = new Date().toISOString().split('T')[0];
      const { error: updateError } = await window.ezsite.apis.tableUpdate(MEMBERS_TABLE_ID, {
        ID: member.ID,
        status: 'unsubscribed',
        unsubscribed_date: today
      });

      if (updateError) {
        throw new Error(updateError);
      }

      // Send confirmation email using fixed template
      const { error: emailError } = await sendUnsubscribeConfirmationEmail({
        to: email,
        fullName: member.full_name || '',
        resubscribeLink: window.location.origin
      });

      if (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Still mark as success since unsubscribe worked
      }

      setStatus('success');

    } catch (err) {
      console.error('Unsubscribe error:', err);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  // If no email in URL, show error immediately
  useEffect(() => {
    if (!email) {
      setStatus('error');
      setErrorMessage('No email address provided in the link.');
    }
  }, [email]);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__content reveal">
            <p className="text-accent">Newsletter</p>
            <h1>Unsubscribe</h1>
            <p className="page-hero__subtitle">
              Manage your email preferences
            </p>
          </div>
        </div>
        <div className="divider divider--bottom">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--color-cream)">
            <path d="M0,20 C480,60 960,10 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Unsubscribe Content */}
      <section className="unsubscribe-section">
        <div className="container">
          <div className="unsubscribe-card reveal">
            {status === 'idle' && email &&
            <>
                <div className="unsubscribe-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                    <line x1="2" y1="20" x2="8" y2="14" />
                    <line x1="16" y1="14" x2="22" y2="20" />
                  </svg>
                </div>
                <h2>Confirm Unsubscribe</h2>
                <p className="unsubscribe-email">{email}</p>
                <p className="unsubscribe-message">
                  Are you sure you want to unsubscribe from our newsletter?
                  You'll no longer receive updates about our events and community news.
                </p>
                <button
                className="btn btn--primary btn--lg"
                onClick={handleUnsubscribe}>

                  Yes, unsubscribe me
                </button>
                <p className="unsubscribe-note">
                  Changed your mind? Simply close this page to stay subscribed.
                </p>
              </>
            }

            {status === 'loading' &&
            <div className="unsubscribe-loading">
                <div className="spinner"></div>
                <p>Processing your request...</p>
              </div>
            }

            {status === 'success' &&
            <>
                <div className="unsubscribe-icon unsubscribe-icon--success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2.5 2.5L16 9" />
                  </svg>
                </div>
                <h2>Successfully Unsubscribed</h2>
                <p className="unsubscribe-message">
                  You have been removed from our mailing list.
                  A confirmation email has been sent to <strong>{email}</strong>.
                </p>
                <p className="unsubscribe-note">
                  We're sorry to see you go. If you ever want to rejoin,
                  you're always welcome back!
                </p>
              </>
            }

            {status === 'not-found' &&
            <>
                <div className="unsubscribe-icon unsubscribe-icon--warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <h2>Email Not Found</h2>
                <p className="unsubscribe-message">
                  We couldn't find <strong>{email}</strong> in our mailing list.
                  You may have already been unsubscribed or the email was entered incorrectly.
                </p>
              </>
            }

            {status === 'already-unsubscribed' &&
            <>
                <div className="unsubscribe-icon unsubscribe-icon--info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <h2>Already Unsubscribed</h2>
                <p className="unsubscribe-message">
                  The email <strong>{email}</strong> has already been unsubscribed from our newsletter.
                </p>
              </>
            }

            {status === 'error' &&
            <>
                <div className="unsubscribe-icon unsubscribe-icon--error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h2>Something Went Wrong</h2>
                <p className="unsubscribe-message">
                  {errorMessage}
                </p>
              </>
            }
          </div>
        </div>
      </section>
    </>);

}