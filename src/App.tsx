import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Language = 'fr' | 'ar' | 'en'
type FormValues = { name: string; phone: string }
type FormErrors = Partial<Record<keyof FormValues, string>>

type Copy = {
  nav: { about: string; care: string; contact: string; appointment: string }
  hero: { eyebrow: string; title: string; titleEmphasis: string; description: string; note: string; patients: string; caption: string }
  about: { kicker: string; eyebrow: string; title: string; titleEmphasis: string; lead: string; bio: string; link: string; experience: string; languages: string; languagesDetail: string; location: string; practice: string }
  appointment: { kicker: string; title: string; titleEmphasis: string; description: string; privacy: string; formTitle: string; duration: string; name: string; namePlaceholder: string; phone: string; phonePlaceholder: string; send: string; consent: string; privacyLink: string; emergency: string; emergencyText: string; received: string; thankYou: string; confirmation: string; another: string }
  care: { kicker: string; title: string; titleEmphasis: string; description: string; cardTitles: string[]; cardTexts: string[] }
  credentials: { kicker: string; eyebrow: string; title: string; titleEmphasis: string; milestone1: string; milestone2: string; certification: string; institution: string; recognition: string }
  contact: { kicker: string; title: string; titleEmphasis: string; clinic: string; address: string; touch: string; phone: string; hours: string; hoursValue: string; map: string; directions: string }
  footer: string
  skip: string
  fullNameError: string
  phoneError: string
  invalidPhoneError: string
}

const translations: Record<Language, Copy> = {
  fr: {
    nav: { about: 'À propos', care: 'Soins', contact: 'Contact', appointment: 'Prendre rendez-vous' },
    hero: { eyebrow: 'Cabinet privé · Monastir, Tunisie', title: 'Dr Zina Chouket', titleEmphasis: 'Gynécologue à Monastir.', description: 'Médecin gynécologue, spécialiste en gynécologie obstétrique, la Dre Zina Chouket vous accompagne avec écoute et bienveillance.', note: 'Santé des femmes', patients: 'Nouvelles patientes', caption: 'Une approche réfléchie de votre santé' },
    about: { kicker: 'Votre médecin', eyebrow: "L'humain au cœur de la gynécologie", title: 'Une médecin qui considère', titleEmphasis: 'toute votre histoire.', lead: '« Mon rôle est de vous offrir un espace où vous vous sentez écoutée, comprise et en confiance. »', bio: 'La Dre Zina Chouket Ep Ben Taher compte plusieurs milliers de suivis de grossesse et interventions. Elle exerce principalement dans son cabinet, ainsi qu’au sein de plusieurs cliniques de Monastir et de Sousse.', link: 'En savoir plus sur la Dre Chouket', experience: 'Plusieurs milliers', languages: 'Arabe natif · Français professionnel', languagesDetail: 'Notions d’anglais', location: 'Monastir, Tunisie', practice: 'Suivis et interventions' },
    appointment: { kicker: 'Commencer ici', title: 'Votre santé,', titleEmphasis: 'entre de bonnes mains.', description: 'Laissez vos coordonnées et notre équipe vous contactera pour trouver un créneau adapté.', privacy: 'Votre vie privée compte. Merci de ne pas partager d’informations médicales sensibles dans ce formulaire.', formTitle: 'Demande de rendez-vous', duration: '2 minutes', name: 'Nom complet', namePlaceholder: 'Votre nom', phone: 'Numéro de téléphone', phonePlaceholder: 'Ex. +216 20 000 000', send: 'Envoyer la demande', consent: 'En envoyant ce formulaire, vous acceptez que le cabinet vous contacte au sujet de votre demande.', privacyLink: 'Politique de confidentialité', emergency: 'En cas d’urgence médicale', emergencyText: 'Ce site et ce formulaire ne sont pas surveillés pour les urgences. Contactez les services d’urgence locaux.', received: 'Demande reçue', thankYou: 'Merci,', confirmation: 'Notre équipe vous contactera prochainement pour confirmer votre rendez-vous.', another: 'Envoyer une autre demande' },
    care: { kicker: 'Soins gynécologiques à Monastir', title: 'Des soins qui s’adaptent', titleEmphasis: 'à chaque étape.', description: 'De la consultation au suivi, la Dre Chouket propose une prise en charge complète en gynécologie obstétrique.', cardTitles: ['Consultation en gynécologie obstétrique', 'Suivi de la grossesse', 'Accouchement normal ou par césarienne', 'Échographie morphologique 4D en couleurs', 'Doppler couleur', 'Chirurgie gynécologique classique', 'Infertilité du couple et traitement contre la stérilité', 'Chirurgie par cœlioscopie', 'Maladies et chirurgie du sein', 'Prise en charge de la ménopause', 'Procréation médicalement assistée'], cardTexts: ['Une écoute médicale attentive et des réponses adaptées à chaque situation.', 'Un accompagnement régulier et rassurant pour la femme enceinte.', 'Un suivi personnalisé avant, pendant et après l’accouchement.', 'Une imagerie détaillée pour suivre le développement de votre bébé.', 'Un examen spécialisé pour évaluer la circulation sanguine.', 'Une prise en charge chirurgicale adaptée à votre situation.', 'Bilan et accompagnement du couple face aux difficultés de fertilité.', 'Des interventions mini-invasives selon les indications médicales.', 'Diagnostic, suivi et traitement des pathologies du sein.', 'Un accompagnement personnalisé avant, pendant et après la ménopause.', 'Un accompagnement médical dans les parcours de procréation assistée.'] },
    credentials: { kicker: 'Parcours professionnel', eyebrow: 'Une expérience engagée', title: 'Une expertise', titleEmphasis: 'en laquelle vous pouvez avoir confiance.', milestone1: 'Début de la pratique en gynécologie obstétrique', milestone2: 'Plusieurs milliers de suivis de grossesse et d’interventions, enrichis par des congrès et de nombreuses attestations', certification: 'Maîtrise des nouvelles technologies en gynécologie', institution: 'Cabinet principal · Cliniques Debbabi, Swani et Carthage · Monastir', recognition: 'Clinique Salem · Sousse' },
    contact: { kicker: 'Nous rencontrer', title: 'Accordez du temps', titleEmphasis: 'à votre bien-être.', clinic: 'Cabinet', address: 'Avenue du Combattant Suprême\nImm Khelifa, 1er étage\n5000 Monastir, Tunisie', touch: 'Nous contacter', phone: '+216 73 449 417 / +216 96 005 657', hours: 'Horaires', hoursValue: '08h30 – 14h30, du lundi au samedi\nDimanche : jour de repos', map: 'Emplacement', directions: 'Voir l’itinéraire' },
    footer: 'Cabinet de gynécologie · Monastir, Tunisie', skip: 'Aller à la demande de rendez-vous', fullNameError: 'Veuillez saisir votre nom complet.', phoneError: 'Veuillez saisir votre numéro de téléphone.', invalidPhoneError: 'Veuillez saisir un numéro de téléphone valide.'
  },
  ar: {
    nav: { about: 'عن الطبيبة', care: 'الخدمات', contact: 'اتصل بنا', appointment: 'احجزي موعداً' },
    hero: { eyebrow: 'عيادة خاصة · المنستير، تونس', title: 'رعاية تبدأ', titleEmphasis: 'بالاستماع إليكِ.', description: 'تقدم الدكتورة زينة شوكت رعاية نسائية متأنية وودودة في كل مرحلة من مراحل حياة المرأة.', note: 'صحة المرأة', patients: 'نستقبل مريضات جديدات', caption: 'رعاية متأنية لصحتكِ' },
    about: { kicker: 'طبيبتكِ', eyebrow: 'الجانب الإنساني في طب النساء', title: 'طبيبة ترى', titleEmphasis: 'الصورة كاملة.', lead: '« دوري هو أن أوفر لكِ مساحة تشعرين فيها بأنكِ مسموعة ومفهومة وواثقة. »', bio: '[نبذة عن الطبيبة] تجمع الدكتورة شوكت بين الدقة الطبية والإنصات والوقت لفهم كل قصة.', link: 'اكتشفي المزيد عن الدكتورة شوكت', experience: '[سنوات الخبرة]', languages: '[اللغات]', languagesDetail: '[مستوى اللغات]', location: 'المنستير، تونس', practice: 'سنوات في الممارسة' },
    appointment: { kicker: 'ابدئي من هنا', title: 'صحتكِ', titleEmphasis: 'في أيدٍ أمينة.', description: 'اتركي بياناتكِ وسيتواصل معكِ فريق العيادة للعثور على موعد مناسب.', privacy: 'خصوصيتكِ مهمة. يرجى عدم إدخال معلومات طبية حساسة في هذا النموذج.', formTitle: 'طلب موعد', duration: 'دقيقتان', name: 'الاسم الكامل', namePlaceholder: 'اسمكِ', phone: 'رقم الهاتف', phonePlaceholder: 'مثال: 20 000 000', send: 'إرسال الطلب', consent: 'بإرسال هذا النموذج، توافقين على أن تتواصل معكِ العيادة بخصوص طلبكِ.', privacyLink: 'سياسة الخصوصية', emergency: 'في الحالات الطبية الطارئة', emergencyText: 'هذا الموقع ونموذج المواعيد غير مخصصين للطوارئ. يرجى الاتصال بخدمات الطوارئ المحلية.', received: 'تم استلام الطلب', thankYou: 'شكراً،', confirmation: 'سيتواصل معكِ فريقنا قريباً لتأكيد موعدكِ.', another: 'إرسال طلب آخر' },
    care: { kicker: 'كيف نساعدكِ', title: 'رعاية تناسب', titleEmphasis: 'كل مرحلة.', description: 'من الاستشارة الأولى إلى المتابعة، صُمم كل موعد ليكون واضحاً وهادئاً وشخصياً.', cardTitles: ['[استشارة نسائية]', '[متابعة الحمل]', '[الوقاية والعافية]'], cardTexts: ['استماع أولي وإجابات واضحة تناسب احتياجاتكِ.', 'مرافقة متأنية ومطمئنة في كل مرحلة من الحمل.', 'استشارات وقائية في مساحة خاصة وودودة.'] },
    credentials: { kicker: 'المسار المهني', eyebrow: 'خبرة ملتزمة', title: 'خبرة يمكنكِ', titleEmphasis: 'أن تثقي بها.', milestone1: '[محطة مهنية 1]', milestone2: '[محطة مهنية 2]', certification: '[شهادة أو مؤهل]', institution: '[مستشفى أو مؤسسة]', recognition: '[جائزة أو تقدير مهني]' },
    contact: { kicker: 'نلتقي بكِ', title: 'امنحي وقتاً', titleEmphasis: 'لصحتكِ ورفاهكِ.', clinic: 'العيادة', address: '[عنوان العيادة]\nالمنستير، تونس', touch: 'تواصلي معنا', phone: '+216 00 000 000', hours: 'ساعات العمل', hoursValue: '[ساعات العمل]\nبموعد مسبق', map: 'الموقع', directions: 'عرض الاتجاهات' },
    footer: 'عيادة طب النساء · المنستير، تونس', skip: 'الانتقال إلى طلب موعد', fullNameError: 'يرجى إدخال اسمكِ الكامل.', phoneError: 'يرجى إدخال رقم هاتفكِ.', invalidPhoneError: 'يرجى إدخال رقم هاتف صحيح.'
  },
  en: {
    nav: { about: 'About', care: 'Care', contact: 'Contact', appointment: 'Request an appointment' },
    hero: { eyebrow: 'Private practice · Monastir, Tunisia', title: 'Care that begins', titleEmphasis: 'with listening.', description: 'Dr. Zina Chouket offers thoughtful, compassionate gynecological care for every stage of a woman’s life.', note: 'Women’s health', patients: 'Taking new patients', caption: 'A considered approach to your health' },
    about: { kicker: 'Meet your doctor', eyebrow: 'The human side of gynecology', title: 'A doctor who sees', titleEmphasis: 'the whole picture.', lead: '“My role is to create a space where you feel heard, understood, and confident.”', bio: '[Doctor biography] Dr. Chouket combines clinical precision with time to understand every patient’s story.', link: 'More about Dr. Chouket', experience: '[Years of experience]', languages: '[Languages spoken]', languagesDetail: '[Language levels]', location: 'Monastir, Tunisia', practice: 'Years in practice' },
    appointment: { kicker: 'Begin here', title: 'Your health,', titleEmphasis: 'in good hands.', description: 'Leave your details and our clinic team will contact you to find a suitable time.', privacy: 'Your privacy matters. Please do not include sensitive medical details in this form.', formTitle: 'Appointment request', duration: '2 minutes', name: 'Full name', namePlaceholder: 'Your name', phone: 'Phone number', phonePlaceholder: 'e.g. +216 20 000 000', send: 'Send request', consent: 'By submitting, you agree that the clinic may contact you about your request.', privacyLink: 'Privacy notice', emergency: 'For urgent medical situations', emergencyText: 'This website and appointment form are not monitored for emergencies. Please contact local emergency services.', received: 'Request received', thankYou: 'Thank you,', confirmation: 'Our clinic team will contact you shortly to confirm an appointment time.', another: 'Send another request' },
    care: { kicker: 'Ways we can help', title: 'Care that meets', titleEmphasis: 'you where you are.', description: 'From your first consultation to ongoing support, every appointment is designed to feel clear, calm, and personal.', cardTitles: ['[Gynecology consultation]', '[Pregnancy care]', '[Prevention and wellbeing]'], cardTexts: ['Thoughtful first visits and clear next steps shaped around your concerns.', 'Attentive, reassuring support through every stage of pregnancy.', 'Preventive consultations in a confidential and welcoming space.'] },
    credentials: { kicker: 'Practice notes', eyebrow: 'A considered career', title: 'Experience you', titleEmphasis: 'can trust.', milestone1: '[Career milestone 1]', milestone2: '[Career milestone 2]', certification: '[Certification or qualification]', institution: '[Hospital, clinic, or institution]', recognition: '[Award or professional recognition]' },
    contact: { kicker: 'Come and see us', title: 'Make time for', titleEmphasis: 'your wellbeing.', clinic: 'Clinic', address: '[Clinic address placeholder]\nMonastir, Tunisia', touch: 'Get in touch', phone: '+216 00 000 000', hours: 'Opening hours', hoursValue: '[Opening hours placeholder]\nBy appointment', map: 'Map placeholder', directions: 'View directions' },
    footer: 'Gynecology practice · Monastir, Tunisia', skip: 'Skip to appointment request', fullNameError: 'Please enter your full name.', phoneError: 'Please enter your phone number.', invalidPhoneError: 'Please enter a valid phone number.'
  }
}

const languageLabels = { fr: 'Français', ar: 'العربية', en: 'English' }

function App() {
  const [language, setLanguage] = useState<Language>('fr')
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [values, setValues] = useState<FormValues>({ name: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const copy = translations[language]
  const isArabic = language === 'ar'

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    setLanguageMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!values.name.trim()) nextErrors.name = copy.fullNameError
    if (!values.phone.trim()) nextErrors.phone = copy.phoneError
    else if (!/^[+\d][\d\s().-]{7,}$/.test(values.phone.trim())) nextErrors.phone = copy.invalidPhoneError
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
    <div className="site-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <a className="skip-link" href="#appointment">{copy.skip}</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dr. Zina Chouket home"><img className="wordmark-photo" src="/media/Dr-zina-chouket-1.jpg" alt="" aria-hidden="true" /><strong>Dr. Zina Chouket</strong></a>
        <nav aria-label={copy.nav.about}><a href="#about">{copy.nav.about}</a><a href="#care">{copy.nav.care}</a><a href="#contact">{copy.nav.contact}</a></nav>
        <div className="header-actions"><div className={`language-picker ${languageMenuOpen ? 'is-open' : ''}`} onKeyDown={(event) => { if (event.key === 'Escape') setLanguageMenuOpen(false) }}><button className="language-trigger" type="button" aria-haspopup="listbox" aria-expanded={languageMenuOpen} onClick={() => setLanguageMenuOpen(!languageMenuOpen)}><span className="language-globe" aria-hidden="true">◎</span><span>{languageLabels[language]}</span><span className="language-chevron" aria-hidden="true">⌄</span></button>{languageMenuOpen && <div className="language-menu" role="listbox" aria-label="Language"><div className="language-menu-label">Choose language</div>{(Object.keys(languageLabels) as Language[]).map((option) => <button className={`language-option ${language === option ? 'is-selected' : ''}`} key={option} type="button" role="option" aria-selected={language === option} onClick={() => selectLanguage(option)}><span className="language-code">{option.toUpperCase()}</span><span>{languageLabels[option]}</span>{language === option && <span className="language-check" aria-hidden="true">✓</span>}</button>)}</div>}</div><a className="header-cta" href="#appointment">{copy.nav.appointment} <span aria-hidden="true">↗</span></a></div>
      </header>

      <main>
        <section className="hero" id="top">
          <iframe className="hero-video" src="https://www.youtube.com/embed/NYTcA_i47C4?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=NYTcA_i47C4&start=342&end=372&modestbranding=1&rel=0&playsinline=1" title="Background video" allow="autoplay; encrypted-media" aria-hidden="true" />
          <div className="hero-image-fallback" aria-hidden="true" /><div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content"><p className="eyebrow light"><span className="eyebrow-dot" /> {copy.hero.eyebrow}</p><h1>{copy.hero.title}<br /><em>{copy.hero.titleEmphasis}</em></h1><p className="hero-copy">{copy.hero.description}</p><a className="button button-light hero-cta" href="#appointment">{copy.nav.appointment} <span aria-hidden="true">↗</span></a></div>
          <div className="hero-note hero-note-top"><span>01</span><p>{copy.hero.note}</p></div><div className="hero-note hero-note-bottom"><span className="mini-mark">✳</span><p>{copy.hero.patients}</p></div><div className="hero-caption">{copy.hero.caption} <span>↘</span></div>
        </section>

        <section className="intro section-wrap" id="about"><div className="section-kicker"><span>02</span><span>{copy.about.kicker}</span></div><div className="intro-grid"><div className="intro-heading"><p className="eyebrow">{copy.about.eyebrow}</p><h2>{copy.about.title}<br /><em>{copy.about.titleEmphasis}</em></h2></div><div className="intro-copy"><p className="lead">{copy.about.lead}</p><p>{copy.about.bio}</p><a className="text-link" href="#contact">{copy.about.link} <span aria-hidden="true">↗</span></a><div className="doctor-photo-frame"><img src="/media/Dr-zina-chouket-1.jpg" alt="Dre Zina Chouket" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.nextElementSibling?.classList.add('is-visible') }} /><span className="doctor-photo-fallback">ZC</span></div></div></div><div className="facts-row"><div><strong>{copy.about.experience}</strong><span>{copy.about.practice}</span></div><div><strong>{copy.about.languages}</strong><span>{copy.about.languagesDetail}</span></div><div><strong>{copy.about.location}</strong><span>{copy.contact.clinic}</span></div></div></section>

        <section className="appointment-section section-wrap" id="appointment"><div className="appointment-panel"><div className="appointment-copy"><div className="section-kicker light"><span>03</span><span>{copy.appointment.kicker}</span></div><h2>{copy.appointment.title}<br /><em>{copy.appointment.titleEmphasis}</em></h2><p>{copy.appointment.description}</p><div className="privacy-note"><span aria-hidden="true">◇</span><p>{copy.appointment.privacy}</p></div></div><div className="form-area">{submitted ? <div className="confirmation" role="status"><span className="confirmation-mark">✓</span><p className="eyebrow">{copy.appointment.received}</p><h3>{copy.appointment.thankYou} {values.name.split(' ')[0]}.</h3><p>{copy.appointment.confirmation}</p><button className="text-link button-reset" type="button" onClick={resetForm}>{copy.appointment.another} <span aria-hidden="true">↗</span></button></div> : <form onSubmit={handleSubmit} noValidate><div className="form-heading"><span>{copy.appointment.formTitle}</span><span>{copy.appointment.duration}</span></div><label htmlFor="name">{copy.appointment.name}<input id="name" name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder={copy.appointment.namePlaceholder} />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label><label htmlFor="phone">{copy.appointment.phone}<input id="phone" name="phone" type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} placeholder={copy.appointment.phonePlaceholder} />{errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}</label><button className="button button-dark submit-button" type="submit">{copy.appointment.send} <span aria-hidden="true">↗</span></button><p className="form-consent">{copy.appointment.consent} <a href="#privacy">{copy.appointment.privacyLink}</a></p></form>}</div></div><div className="emergency-note"><strong>{copy.appointment.emergency}</strong><span>{copy.appointment.emergencyText}</span></div></section>

        <section className="care section-wrap" id="care"><div className="section-kicker"><span>04</span><span>{copy.care.kicker}</span></div><div className="care-heading"><h2>{copy.care.title}<br /><em>{copy.care.titleEmphasis}</em></h2><p>{copy.care.description}</p></div><div className="services-grid">{copy.care.cardTitles.map((title, index) => <article className="service-card" key={title}><span className="service-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy.care.cardTexts[index]}</p><a href="#appointment" aria-label={`${copy.nav.appointment}: ${title}`}><span aria-hidden="true">↗</span></a></article>)}</div></section>

        <section className="credentials section-wrap"><div className="section-kicker"><span>05</span><span>{copy.credentials.kicker}</span></div><div className="credentials-grid"><div><p className="eyebrow">{copy.credentials.eyebrow}</p><h2>{copy.credentials.title}<br /><em>{copy.credentials.titleEmphasis}</em></h2></div><div className="timeline"><div><span>2008</span><p>{copy.credentials.milestone1}<br /><small>{copy.credentials.institution}</small></p></div><div><span>{language === 'fr' ? "Aujourd’hui" : language === 'ar' ? 'اليوم' : 'Today'}</span><p>{copy.credentials.milestone2}<br /><small>{copy.credentials.certification}<br />{copy.credentials.recognition}</small></p></div></div></div></section>

        <section className="contact section-wrap" id="contact"><div className="contact-panel"><div><div className="section-kicker light"><span>06</span><span>{copy.contact.kicker}</span></div><h2>{copy.contact.title}<br /><em>{copy.contact.titleEmphasis}</em></h2><a className="button button-light" href="#appointment">{copy.nav.appointment} <span aria-hidden="true">↗</span></a></div><div className="contact-details"><div><span>{copy.contact.clinic}</span><p>{copy.contact.address.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div><div><span>{copy.contact.touch}</span><p><a href="tel:+21673449417">{copy.contact.phone}</a></p></div><div><span>{copy.contact.hours}</span><p>{copy.contact.hoursValue.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p></div></div><div className="map-placeholder"><iframe src="https://www.google.com/maps?q=35.7714673,10.8241062&z=16&output=embed" title={copy.contact.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-overlay"><span>{copy.contact.map}</span><a href="https://www.google.com/maps/place/Gyn%C3%A9cologue+Dr+Zina+Chouket/@35.7714673,10.8215313,707m/data=!3m2!1e3!4b1!4m6!3m5!1s0x1302134fbec4fb83:0x17731dfbd508f06e!8m2!3d35.7714673!4d10.8241062!16s%2Fg%2F11y8brhzpx?hl=es&entry=ttu&g_ep=EgoyMDI2MDkyOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer">{copy.contact.directions}&nbsp; ↗</a></div></div></div></section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top"><img className="wordmark-photo" src="/media/Dr-zina-chouket-1.jpg" alt="" aria-hidden="true" /><strong>Dr. Zina Chouket</strong></a><p>{copy.footer}</p><a href="#privacy" id="privacy">{copy.appointment.privacyLink} &amp; accessibilité</a></footer>
    </div>
  )
}

export default App
