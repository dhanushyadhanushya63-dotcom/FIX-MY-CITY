import { createContext, useContext, useEffect, useState } from 'react';

const EN = {
  n_home: 'Home', n_register: 'Register Complaint', n_track: 'Track Status', n_about: 'About', n_feedback: 'Feedback', n_dash: 'Dashboard', n_lang: 'Language',
  h_a: 'Report. Resolve.', h_b: 'Build a Better City.', h_sub: 'File your civic complaint easily and track the progress from first report to proof of repair.', h_reg: 'Register Complaint', h_track: 'Track Status',
  f1t: 'Quick Report in Minutes', f1d: 'Photo, pin and a short note', f2t: 'Track Status Online', f2d: 'Follow every step of the fix',
  f3t: 'Transparent Process', f3d: 'Every change is recorded', f4t: 'A Cleaner & Greener City', f4d: 'Fixed faster, together',
  w_title: 'How a complaint moves', w_sub: 'Six steps. Each one is recorded with who made the change and when.',
  s0t: 'Submitted', s0d: 'Photo, category and location are captured and saved.',
  s1t: 'Under review', s1d: 'The admin checks the details and any duplicate flags.',
  s2t: 'Assigned', s2d: 'The complaint is mapped to the right authority team.',
  s3t: 'In progress', s3d: 'The team updates the work status and remarks.',
  s4t: 'Resolved', s4d: 'An after-repair photo is uploaded as proof.',
  s5t: 'Closed', s5d: 'The citizen checks the outcome and rates the work.',
  r_c: 'Citizen', r_a: 'Admin', r_u: 'Authority team',
  w_note: 'Audit trail: every status change records who made it and when, and the citizen is notified.',
  ft_about: 'Report local problems, follow every fix and see the proof when the work is done.', ft_links: 'Quick links', ft_contact: 'Contact us',
  ft_name: 'Name', ft_email: 'Email ID', ft_q: 'Your query', ft_submit: 'Submit query', ft_pilot: 'Proposed pilot: Chennai neighbourhoods',
  e_name: 'Enter your name.', e_email: 'Enter a valid email ID.', e_q: 'Write your query in at least 10 characters.', e_msg: 'Write your message in at least 10 characters.',
  th_t: 'Thank you!', th_q: 'We received your query and will reply to your email ID.', th_f: 'Your feedback helps us make the city better.', th_close: 'Close',
  fb_title: 'Feedback & Suggestions', fb_sub: 'Tell us what works and what should change. Every message is read.', fb_type: 'This is a', fb_fb: 'Feedback', fb_su: 'Suggestion',
  fb_rate: 'How was your experience?', fb_name: 'Name (optional)', fb_email: 'Email ID (optional)', fb_msg: 'Your message', fb_send: 'Send',
  tr_title: 'Track Status', tr_ph: 'Enter Complaint ID (e.g. FMS-103)', tr_btn: 'Track', tr_miss: 'No complaint found with that ID. Use the ID shown after you registered, for example FMS-103.',
  tr_journey: 'The journey of a complaint', tr_journey_d: 'Every complaint passes the same six stops. Enter an ID above, or pick one of yours, to see where it is.',
  tr_where: 'Where your complaint is now', tr_where_d: 'Green stops are done. The pulsing stop is the current one.',
  tr_guide: 'What each status means', tr_recent: 'Your recent complaints', tr_cat: 'Category', tr_sub: 'Submitted', tr_by: 'Handled by', tr_another: 'Track another complaint',
  ab_title: 'About FixMyStreet', ab_lead: 'A single place where residents report local problems and city teams fix them in the open.',
  ab_why: 'Why use FixMyStreet?', ab_before: 'Today', ab_after: 'With FixMyStreet',
  p1b: 'Reporting channels are scattered', p1a: 'One place to report every civic issue',
  p2b: 'You cannot see how far a fix has come', p2a: 'Follow every step with a complaint ID',
  p3b: 'Repeat reports can be missed', p3a: 'Duplicates are flagged and repeat reports raise the priority',
  p4b: 'Proof of repair is not visible', p4a: 'An after-repair photo is attached before a case is resolved',
  ab_who: 'Who can use this website?',
  u1t: 'Residents', u1d: 'Anyone in the pilot area. Pick a category, drop a pin, add a photo, then track the complaint with its ID and rate the result. No sign-in needed in this demo.',
  u2t: 'Admin desk', u2d: 'Reviews incoming complaints, checks duplicate flags, watches overdue cases and assigns each complaint to a team.',
  u3t: 'Authority teams', u3d: 'Roads, sanitation, water and lighting teams. They see assigned complaints, update work status and upload proof.',
  ab_signin: 'Staff sign in with the user icon at the top right. Each role sees only its own dashboard.',
  ab_checks: 'Built-in checks',
  k1t: 'Duplicate detection', k1d: 'Same category within 60 m of an open report is flagged. The admin decides.',
  k2t: 'Priority scoring', k2d: 'Severity, age and repeat reports give Low, Medium or High.',
  k3t: 'Hotspot map', k3d: 'Complaints are plotted on OpenStreetMap, so teams see where issues cluster.',
  k4t: 'Overdue escalation', k4d: 'A case still open after 5 days is marked overdue for follow-up.',
};

const TA = {
  n_home: 'முகப்பு', n_register: 'புகார் பதிவு', n_track: 'நிலை அறிய', n_about: 'எங்களைப் பற்றி', n_feedback: 'கருத்து', n_dash: 'டாஷ்போர்டு', n_lang: 'மொழி',
  h_a: 'புகாரளியுங்கள். தீர்வு பெறுங்கள்.', h_b: 'சிறந்த நகரத்தை உருவாக்குங்கள்.', h_sub: 'உங்கள் குடிமைப் புகாரை எளிதாகப் பதிவு செய்து, முதல் புகார் முதல் பழுது நீக்கிய ஆதாரம் வரை பின்தொடருங்கள்.', h_reg: 'புகார் பதிவு செய்', h_track: 'நிலை அறிய',
  f1t: 'நிமிடங்களில் புகார்', f1d: 'புகைப்படம், இடம், சிறு குறிப்பு', f2t: 'ஆன்லைனில் நிலை அறிதல்', f2d: 'தீர்வின் ஒவ்வொரு படியையும் பின்தொடருங்கள்',
  f3t: 'வெளிப்படையான செயல்முறை', f3d: 'ஒவ்வொரு மாற்றமும் பதிவாகும்', f4t: 'தூய்மையான, பசுமையான நகரம்', f4d: 'ஒன்றிணைந்து விரைவாகச் சரிசெய்வோம்',
  w_title: 'புகார் எவ்வாறு நகர்கிறது', w_sub: 'ஆறு படிகள். ஒவ்வொன்றும் யார், எப்போது மாற்றினார் என்று பதிவாகும்.',
  s0t: 'சமர்ப்பிக்கப்பட்டது', s0d: 'புகைப்படம், வகை, இடம் பதிவாகிச் சேமிக்கப்படும்.',
  s1t: 'ஆய்வில்', s1d: 'நிர்வாகி விவரங்களையும் நகல் குறிகளையும் சரிபார்ப்பார்.',
  s2t: 'ஒதுக்கப்பட்டது', s2d: 'புகார் சரியான அதிகாரி குழுவுக்கு ஒதுக்கப்படும்.',
  s3t: 'பணியில்', s3d: 'குழு பணி நிலையையும் குறிப்புகளையும் புதுப்பிக்கும்.',
  s4t: 'தீர்க்கப்பட்டது', s4d: 'பழுது நீக்கிய பின் புகைப்பட ஆதாரம் பதிவேற்றப்படும்.',
  s5t: 'முடிக்கப்பட்டது', s5d: 'குடிமக்கள் முடிவைப் பார்த்து பணியை மதிப்பிடுவர்.',
  r_c: 'குடிமக்கள்', r_a: 'நிர்வாகி', r_u: 'அதிகாரி குழு',
  w_note: 'தணிக்கைப் பதிவு: ஒவ்வொரு நிலை மாற்றமும் யார், எப்போது செய்தார் என்பதைப் பதிவு செய்து, குடிமக்களுக்கு அறிவிக்கும்.',
  ft_about: 'உள்ளூர் பிரச்சினைகளைப் புகாரளியுங்கள், ஒவ்வொரு தீர்வையும் பின்தொடருங்கள், பணி முடிந்ததும் ஆதாரத்தைப் பாருங்கள்.', ft_links: 'விரைவு இணைப்புகள்', ft_contact: 'தொடர்புக்கு',
  ft_name: 'பெயர்', ft_email: 'மின்னஞ்சல் முகவரி', ft_q: 'உங்கள் கேள்வி', ft_submit: 'கேள்வியை அனுப்பு', ft_pilot: 'முன்மொழியப்பட்ட சோதனைத் திட்டம்: சென்னை பகுதிகள்',
  e_name: 'பெயரை உள்ளிடவும்.', e_email: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.', e_q: 'கேள்வியை குறைந்தது 10 எழுத்துகளில் எழுதவும்.', e_msg: 'செய்தியை குறைந்தது 10 எழுத்துகளில் எழுதவும்.',
  th_t: 'நன்றி!', th_q: 'உங்கள் கேள்வி கிடைத்தது. உங்கள் மின்னஞ்சலுக்குப் பதிலளிப்போம்.', th_f: 'உங்கள் கருத்து நகரத்தை மேம்படுத்த உதவும்.', th_close: 'மூடு',
  fb_title: 'கருத்துகள் & பரிந்துரைகள்', fb_sub: 'எது நன்றாக உள்ளது, எதை மாற்ற வேண்டும் என்று சொல்லுங்கள். ஒவ்வொரு செய்தியும் படிக்கப்படும்.', fb_type: 'இது ஒரு', fb_fb: 'கருத்து', fb_su: 'பரிந்துரை',
  fb_rate: 'உங்கள் அனுபவம் எப்படி இருந்தது?', fb_name: 'பெயர் (விருப்பம்)', fb_email: 'மின்னஞ்சல் (விருப்பம்)', fb_msg: 'உங்கள் செய்தி', fb_send: 'அனுப்பு',
  tr_title: 'நிலை அறிய', tr_ph: 'புகார் எண்ணை உள்ளிடவும் (எ.கா. FMS-103)', tr_btn: 'தேடு', tr_miss: 'அந்த எண்ணில் புகார் இல்லை. பதிவு செய்த பிறகு காட்டப்பட்ட எண்ணைப் பயன்படுத்தவும், எ.கா. FMS-103.',
  tr_journey: 'ஒரு புகாரின் பயணம்', tr_journey_d: 'ஒவ்வொரு புகாரும் இதே ஆறு நிலைகளைக் கடக்கும். மேலே எண்ணை உள்ளிடவும் அல்லது உங்கள் புகாரைத் தேர்ந்தெடுக்கவும்.',
  tr_where: 'உங்கள் புகார் இப்போது எங்கே உள்ளது', tr_where_d: 'பச்சை நிலைகள் முடிந்தவை. ஒளிரும் நிலை தற்போதையது.',
  tr_guide: 'ஒவ்வொரு நிலையின் பொருள்', tr_recent: 'உங்கள் சமீபத்திய புகார்கள்', tr_cat: 'வகை', tr_sub: 'சமர்ப்பித்தது', tr_by: 'கையாள்வது', tr_another: 'வேறொரு புகாரைத் தேடு',
  ab_title: 'FixMyStreet பற்றி', ab_lead: 'குடிமக்கள் உள்ளூர் பிரச்சினைகளைப் புகாரளிக்கவும், நகரக் குழுக்கள் வெளிப்படையாகத் தீர்க்கவும் உதவும் ஒரே தளம்.',
  ab_why: 'FixMyStreet ஏன் பயன்படுத்த வேண்டும்?', ab_before: 'இன்று', ab_after: 'FixMyStreet உடன்',
  p1b: 'புகார் வழிகள் சிதறி உள்ளன', p1a: 'எல்லா குடிமைப் பிரச்சினைகளுக்கும் ஒரே இடம்',
  p2b: 'தீர்வு எவ்வளவு முன்னேறியது என்று தெரியாது', p2a: 'புகார் எண்ணுடன் ஒவ்வொரு படியையும் பின்தொடரலாம்',
  p3b: 'மீண்டும் வரும் புகார்கள் தவறவிடப்படலாம்', p3a: 'நகல்கள் குறிக்கப்படும்; மீண்டும் வரும் புகார்கள் முன்னுரிமையை உயர்த்தும்',
  p4b: 'பழுது நீக்கியதற்கான ஆதாரம் தெரிவதில்லை', p4a: 'தீர்வு எனக் குறிக்கும் முன் பழுது நீக்கிய புகைப்படம் இணைக்கப்படும்',
  ab_who: 'இந்த இணையதளத்தை யார் பயன்படுத்தலாம்?',
  u1t: 'குடிமக்கள்', u1d: 'சோதனைப் பகுதியில் உள்ள எவரும். வகையைத் தேர்ந்தெடுத்து, வரைபடத்தில் இடத்தைக் குறித்து, புகைப்படம் சேர்த்து, புகார் எண்ணால் நிலையை அறிந்து மதிப்பிடலாம். இந்த டெமோவில் உள்நுழைவு தேவையில்லை.',
  u2t: 'நிர்வாகி மேசை', u2d: 'வரும் புகார்களை ஆய்வு செய்து, நகல் குறிகளைச் சரிபார்த்து, தாமதமான வழக்குகளைக் கவனித்து, ஒவ்வொரு புகாரையும் ஒரு குழுவுக்கு ஒதுக்குவார்.',
  u3t: 'அதிகாரி குழுக்கள்', u3d: 'சாலை, துப்புரவு, குடிநீர், விளக்குக் குழுக்கள். அவர்கள் ஒதுக்கப்பட்ட புகார்களைப் பார்த்து, பணி நிலையைப் புதுப்பித்து, ஆதாரம் பதிவேற்றுவர்.',
  ab_signin: 'ஊழியர்கள் மேல் வலது மூலையில் உள்ள பயனர் ஐகான் மூலம் உள்நுழைவர். ஒவ்வொரு பங்கும் தனக்குரிய டாஷ்போர்டை மட்டுமே பார்க்கும்.',
  ab_checks: 'உள்ளமைந்த சோதனைகள்',
  k1t: 'நகல் கண்டறிதல்', k1d: 'திறந்த புகாரிலிருந்து 60 மீட்டருக்குள் அதே வகை இருந்தால் குறிக்கப்படும். நிர்வாகி முடிவு செய்வார்.',
  k2t: 'முன்னுரிமை மதிப்பெண்', k2d: 'தீவிரம், நாள், மீண்டும் வரும் புகார்கள் மூலம் குறைவு, நடுத்தரம், அதிகம் எனத் தீர்மானிக்கப்படும்.',
  k3t: 'ஹாட்ஸ்பாட் வரைபடம்', k3d: 'புகார்கள் OpenStreetMap-இல் காட்டப்படும்; எங்கே அதிகம் என்று குழுக்கள் பார்க்கலாம்.',
  k4t: 'தாமத எச்சரிக்கை', k4d: '5 நாட்களுக்குப் பிறகும் திறந்திருக்கும் புகார் தாமதம் எனக் குறிக்கப்படும்.',
};

const D = { en: EN, ta: TA };
export const LANGS = [['en', 'English'], ['ta', 'தமிழ்']];
const Ctx = createContext({ lang: 'en', setLang() {}, t: (k) => EN[k] ?? k });
export const useT = () => useContext(Ctx);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('lang') || 'en'; } catch { return 'en'; } });
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('lang', lang); } catch { /* storage blocked */ } }, [lang]);
  const t = (k) => D[lang]?.[k] ?? EN[k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}
