import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type FormValues = { name: string; phone: string }
type FormErrors = Partial<Record<keyof FormValues, string>>

const services = [
  { number: '01', title: '[Service or consultation type 1]', text: 'Thoughtful first visits and clear next steps, shaped around your concerns.' },
  { number: '02', title: '[Service or consultation type 2]', text: 'Ongoing care that makes space for questions, context, and lasting wellbeing.' },
  { number: '03', title: '[Service or consultation type 3]', text: 'Focused appointments for a calm, considered second perspective.' },
]

function App() {
  const [values, setValues] = useState<FormValues>({ name: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Please enter your full name.'
    if (!values.phone.trim()) nextErrors.phone = 'Please enter your phone number.'
    else if (!/^[+\d][\d\s().-]{7,}$/.test(values.phone.trim())) nextErrors.phone = 'Please enter a valid phone number.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validate()) setSubmitted(true)
  }

  const resetForm = () => {
    setValues({ name: '', phone: '' })
    setErrors({})
    setSubmitted(false)
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#appointment">Skip to appointment request</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dr. Amara Ellis home"><span>AE</span><strong>Dr. Amara Ellis</strong></a>
        <nav aria-label="Primary navigation"><a href="#about">About</a><a href="#care">Care</a><a href="#contact">Contact</a></nav>
        <a className="header-cta" href="#appointment">Request an appointment <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section className="hero" id="top">
          <video className="hero-video" autoPlay muted loop playsInline poster="/media/doctor-office-poster.jpg" aria-hidden="true"><source src="/media/doctor-office.mp4" type="video/mp4" /></video>
          <div className="hero-image-fallback" aria-hidden="true" /><div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content"><p className="eyebrow light"><span className="eyebrow-dot" /> Private practice · London & online</p><h1>Care that begins<br /><em>with listening.</em></h1><p className="hero-copy">Dr. Amara Ellis offers thoughtful, unhurried medical care for every chapter of adult life.</p><a className="button button-light" href="#appointment">Request an appointment <span aria-hidden="true">↗</span></a></div>
          <div className="hero-note hero-note-top"><span>01</span><p>Personal<br />medicine</p></div><div className="hero-note hero-note-bottom"><span className="mini-mark">✳</span><p>Taking new<br />patients</p></div><div className="hero-caption">A considered approach to your health <span>↘</span></div>
        </section>

        <section className="intro section-wrap" id="about"><div className="section-kicker"><span>02</span><span>Meet your doctor</span></div><div className="intro-grid"><div className="intro-heading"><p className="eyebrow">The human side of medicine</p><h2>A doctor who sees<br /><em>the whole picture.</em></h2></div><div className="intro-copy"><p className="lead">“My role is to create a space where you feel heard, understood, and confident about what comes next.”</p><p>[Doctor biography] Dr. Ellis brings a warm, evidence-led approach to every consultation, combining clinical precision with time to understand the person behind the symptoms.</p><a className="text-link" href="#contact">More about Dr. Ellis <span aria-hidden="true">↗</span></a></div></div><div className="facts-row"><div><strong>[Years of experience]</strong><span>Years in practice</span></div><div><strong>[Languages spoken]</strong><span>Languages spoken</span></div><div><strong>[Clinic location]</strong><span>Clinic location</span></div></div></section>

        <section className="appointment-section section-wrap" id="appointment"><div className="appointment-panel"><div className="appointment-copy"><div className="section-kicker light"><span>03</span><span>Begin here</span></div><h2>Your health,<br /><em>in good hands.</em></h2><p>Tell us a little about yourself and our clinic team will be in touch to find a suitable time.</p><div className="privacy-note"><span aria-hidden="true">◇</span><p>Your privacy matters. Please do not include sensitive medical details in this form.</p></div></div><div className="form-area">{submitted ? <div className="confirmation" role="status"><span className="confirmation-mark">✓</span><p className="eyebrow">Request received</p><h3>Thank you, {values.name.split(' ')[0]}.</h3><p>Our clinic team will contact you shortly to confirm an appointment time.</p><button className="text-link button-reset" type="button" onClick={resetForm}>Send another request <span aria-hidden="true">↗</span></button></div> : <form onSubmit={handleSubmit} noValidate><div className="form-heading"><span>Appointment request</span><span>2 minutes</span></div><label htmlFor="name">Full name<input id="name" name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Your name" />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label><label htmlFor="phone">Phone number<input id="phone" name="phone" type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} placeholder="e.g. +44 20 0000 0000" />{errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}</label><button className="button button-dark submit-button" type="submit">Send request <span aria-hidden="true">↗</span></button><p className="form-consent">By submitting, you agree that the clinic may contact you about your request. <a href="#privacy">Privacy notice</a></p></form>}</div></div><div className="emergency-note"><strong>For urgent medical situations</strong><span>This website and appointment form are not monitored for emergencies. Please contact your local emergency services.</span></div></section>

        <section className="care section-wrap" id="care"><div className="section-kicker"><span>04</span><span>Ways we can help</span></div><div className="care-heading"><h2>Care that meets<br /><em>you where you are.</em></h2><p>From your first conversation to ongoing support, every part of the practice is designed to feel clear, calm, and personal.</p></div><div className="services-grid">{services.map((service) => <article className="service-card" key={service.number}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#appointment" aria-label={`Request ${service.title}`}><span aria-hidden="true">↗</span></a></article>)}</div></section>

        <section className="credentials section-wrap"><div className="section-kicker"><span>05</span><span>Practice notes</span></div><div className="credentials-grid"><div><p className="eyebrow">A considered career</p><h2>Experience you<br /><em>can trust.</em></h2></div><div className="timeline"><div><span>2014</span><p>[Career milestone 1]<br /><small>[Hospital, clinic, or institution]</small></p></div><div><span>2019</span><p>[Career milestone 2]<br /><small>[Hospital, clinic, or institution]</small></p></div><div><span>Today</span><p>[Certification or qualification]<br /><small>[Award or professional recognition]</small></p></div></div></div></section>

        <section className="contact section-wrap" id="contact"><div className="contact-panel"><div><div className="section-kicker light"><span>06</span><span>Come and see us</span></div><h2>Make time for<br /><em>your wellbeing.</em></h2><a className="button button-light" href="#appointment">Request an appointment <span aria-hidden="true">↗</span></a></div><div className="contact-details"><div><span>Clinic</span><p>[Clinic address placeholder]<br />London, [Postcode]</p></div><div><span>Get in touch</span><p><a href="tel:+442000000000">+44 20 0000 0000</a><br /><a href="mailto:hello@amaraellis.com">hello@amaraellis.com</a></p></div><div><span>Opening hours</span><p>[Opening hours placeholder]<br />By appointment</p></div></div><div className="map-placeholder"><span>Map placeholder</span><strong>51°30′N&nbsp;&nbsp;0°07′W</strong><span>View directions&nbsp; ↗</span></div></div></section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top"><span>AE</span><strong>Dr. Amara Ellis</strong></a><p>Private medical practice · London & online</p><a href="#privacy" id="privacy">Privacy & accessibility</a></footer>
    </div>
  )
}

export default App
