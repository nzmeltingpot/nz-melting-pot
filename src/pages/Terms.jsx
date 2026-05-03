import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <section className="terms-page" style={{ padding: '120px 24px 80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          marginBottom: '16px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #7B1E2D 0%, #B8860B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          NZMP TALENT SHOWCASE
        </h1>

        <h2 style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          fontWeight: 600,
          marginBottom: '40px',
          textAlign: 'center',
          color: '#4a5568'
        }}>
          Terms & Conditions
        </h2>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          color: '#2d3748',
          lineHeight: 1.8,
          fontSize: '1rem'
        }}>
          <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>
            Last updated: March 2026
          </p>

          {/* Section 1: Overview */}
          <h3 style={sectionHeadingStyle}>1. Overview</h3>
          <p style={paragraphStyle}>
            The NZMP Talent Showcase is an event designed to celebrate and highlight musical talent across all age groups. The event is open to all individuals residing in the Auckland area who are aged 4 years and above, regardless of community or ethnic background.
          </p>

          {/* Section 2: Eligibility & Entry */}
          <h3 style={sectionHeadingStyle}>2. Eligibility & Entry</h3>
          <ul style={listStyle}>
            <li>The event is open to all individuals aged 4 years and above who reside in the Auckland area.</li>
            <li>Participants are permitted one entry per category only.</li>
            <li>Participants may enter the following categories:
              <ul style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '24px', listStyleType: 'circle' }}>
                <li><strong>Vocal</strong> — Solo, Duet, Trio, or Quartet</li>
                <li><strong>Instrumental</strong> — Solo, Duet, or Quartet</li>
              </ul>
            </li>
          </ul>
          <p style={noteStyle}>
            <strong>Please Note:</strong> Age-based category groupings are subject to change and will be confirmed based on the total number of participants registered for the event.
          </p>

          {/* Section 3: Performance Guidelines */}
          <h3 style={sectionHeadingStyle}>3. Performance Guidelines</h3>
          <ul style={listStyle}>
            <li>Each performance must not exceed three (3) minutes in duration.</li>
            <li>Performances exceeding the time limit will be disqualified.</li>
            <li>Timing will commence from the first vocal utterance in a Vocal category performance, and from the first musical note in an Instrumental category performance.</li>
          </ul>

          {/* Section 4: Accompaniment Rules */}
          <h3 style={sectionHeadingStyle}>4. Accompaniment Rules</h3>

          <h4 style={subHeadingStyle}>Vocal Category</h4>
          <ul style={listStyle}>
            <li>Instrumental accompaniment may be provided by a backing band (subject to available funding and sponsorship), another individual, or by the participant themselves.</li>
            <li>Vocal accompaniment — whether live or digitally synthesised (recorded) — is strictly not permitted.</li>
          </ul>

          <h4 style={subHeadingStyle}>Instrumental Category</h4>
          <ul style={listStyle}>
            <li>Both live and recorded accompaniment are permitted; however, participants will be adjudicated primarily on their own individual performance.</li>
            <li>Participants using an electronic keyboard must produce all sound live on stage. Pre-programmed music is strictly prohibited.</li>
            <li>Vocal accompaniment in any form is strictly not permitted.</li>
          </ul>

          {/* Section 5: Participant Commitments & Attendance */}
          <h3 style={sectionHeadingStyle}>5. Participant Commitments & Attendance</h3>
          <ul style={listStyle}>
            <li>All participants must confirm their chosen Vocal or Instrumental piece at least one (1) month prior to the event.</li>
            <li>Last-minute withdrawals will not be eligible for a refund of any entry fee paid.</li>
            <li>Participants are required to attend all meetings, rehearsals, and the entirety of the show. Any inability to attend must be communicated to the NZMP Talent Show Committee at the time of registration.</li>
            <li>Rehearsals are restricted to contestants, accompanists, and authorised NZMP Talent Coordinators.</li>
            <li>Participants must report to event coordinators no later than one (1) hour before the final programme commences. Specific timings will be communicated in advance.</li>
          </ul>

          {/* Section 6: Age Group Categories */}
          <h3 style={sectionHeadingStyle}>6. Age Group Categories</h3>
          <p style={{ marginBottom: '16px' }}>The following age group categories will generally apply:</p>
          <ol style={{ marginBottom: '24px', paddingLeft: '24px', listStyleType: 'decimal' }}>
            <li>Under 6 years</li>
            <li>6 to 12 years</li>
            <li>12 to 18 years</li>
            <li>18 to 35 years</li>
            <li>35 years and above</li>
          </ol>
          <p style={noteStyle}>
            <strong>Please Note:</strong> Age group categories are subject to revision based on the number of registered participants. The NZMP Talent Show Committee reserves the right to add, amend, or remove category groups accordingly.
          </p>

          {/* Section 7: Organisers' Rights & Decisions */}
          <h3 style={sectionHeadingStyle}>7. Organisers' Rights & Decisions</h3>
          <ul style={listStyle}>
            <li>The NZMP Talent Show Committee reserves the right to make final decisions on all matters relating to the event that are not explicitly addressed within these Terms and Conditions.</li>
            <li>The awards and certificates schedule will be determined at the sole discretion of the organisers.</li>
          </ul>

          {/* Section 8: Media & Publicity Consent */}
          <h3 style={sectionHeadingStyle}>8. Media & Publicity Consent</h3>
          <p style={paragraphStyle}>
            By registering and participating in the NZMP Talent Showcase, participants (and, where applicable, their parents or guardians) consent to the use of any photographs, video footage, or recordings captured at the venue. Such material may be used by the NZMP Talent Show organisers for promotional purposes, including but not limited to publication on the official website and in future event advertising.
          </p>

          {/* Additional Section: Code of Conduct */}
          <h3 style={sectionHeadingStyle}>9. Code of Conduct</h3>
          <ul style={listStyle}>
            <li>All participants, audience members, and volunteers are expected to behave respectfully and courteously throughout the event.</li>
            <li>Any behaviour deemed inappropriate, disruptive, or offensive may result in disqualification and removal from the event without refund.</li>
            <li>Participants must respect the decisions of the adjudicators and event organisers at all times.</li>
          </ul>

          {/* Additional Section: Liability & Disclaimer */}
          <h3 style={sectionHeadingStyle}>10. Liability & Disclaimer</h3>
          <ul style={listStyle}>
            <li>Participants are responsible for their own personal belongings, equipment, and instruments.</li>
            <li>The NZMP Talent Show Committee and its organisers are not liable for any loss, damage, or injury that may occur during the event.</li>
            <li>Participants under 18 years of age must have written parental or guardian consent to participate.</li>
            <li>Parents or guardians are responsible for the supervision of minors at all times during the event.</li>
          </ul>

          {/* Additional Section: Privacy */}
          <h3 style={sectionHeadingStyle}>11. Privacy</h3>
          <ul style={listStyle}>
            <li>Personal information collected during registration will be used solely for event administration and communication purposes.</li>
            <li>Your information will not be shared with third parties without your consent, except as required by law or as outlined in Section 8 (Media & Publicity Consent).</li>
          </ul>

          {/* Additional Section: Changes to Terms */}
          <h3 style={sectionHeadingStyle}>12. Changes to Terms</h3>
          <p style={paragraphStyle}>
            The organisers reserve the right to update these terms and conditions at any time. Participants will be notified of any significant changes via the email address provided during registration.
          </p>

          {/* Enquiries Section */}
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(123, 30, 45, 0.08) 0%, rgba(184, 134, 11, 0.08) 100%)',
            borderRadius: '12px',
            borderLeft: '4px solid #7B1E2D'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#7B1E2D',
              marginBottom: '12px',
              marginTop: 0
            }}>
              Enquiries
            </h3>
            <p style={{ margin: 0, color: '#4a5568' }}>
              For enquiries, please contact the NZMP Talent Show Committee through the contact details provided on our website or during the registration process.
            </p>
          </div>

          {/* Acknowledgement Box */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(123, 30, 45, 0.1) 0%, rgba(184, 134, 11, 0.1) 100%)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#7B1E2D' }}>
              By submitting the registration form, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
          </div>

          {/* Back to Form Button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link
              to="/musical-talent-showcase#register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #7B1E2D 0%, #9B2335 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(123, 30, 45, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(123, 30, 45, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(123, 30, 45, 0.3)';
              }}>

              <span style={{ fontSize: '1.2rem' }}>←</span>
              Back to Registration Form
            </Link>
          </div>
        </div>
      </div>
    </section>);

}

const sectionHeadingStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#7B1E2D',
  marginTop: '32px',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '2px solid rgba(123, 30, 45, 0.2)'
};

const subHeadingStyle = {
  fontSize: '1.05rem',
  fontWeight: 600,
  color: '#4a5568',
  marginTop: '20px',
  marginBottom: '12px'
};

const listStyle = {
  marginBottom: '24px',
  paddingLeft: '24px',
  listStyleType: 'disc'
};

const paragraphStyle = {
  marginBottom: '24px'
};

const noteStyle = {
  marginBottom: '24px',
  padding: '16px',
  background: 'rgba(184, 134, 11, 0.1)',
  borderRadius: '8px',
  borderLeft: '3px solid #B8860B',
  fontStyle: 'italic'
};