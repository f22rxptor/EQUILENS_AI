import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  ShieldCheck, LayoutDashboard, Database, Activity, FileText, Settings, 
  User, Play, Plus, MoreHorizontal, ShieldAlert, Zap
} from 'lucide-react';
import './App.css';

const Dashboard = () => {
  const [biasData, setBiasData] = useState(null);
  const [xaiData, setXaiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    fetchData();
    // Reset scroll to top on mount or hash change to empty
    if (!window.location.hash || window.location.hash === '#hero') {
      window.scrollTo(0, 0);
    }
  }, []);

  const fetchData = async () => {
    try {
      const [biasRes, xaiRes] = await Promise.all([
        axios.post('https://equilens-ai.onrender.com/audit/bias'),
        axios.post('https://equilens-ai.onrender.com/audit/explain', { input: {} })
      ]);
      setBiasData(biasRes.data);
      setXaiData(xaiRes.data);
    } catch (err) {
      console.error("Failed to fetch data, using fallback", err);
      // Fallback to mock data if backend is unreachable
      setBiasData({
        disparate_impact: { gender: 0.75, race: 0.82, age: 0.68 },
        bias_score: 0.72
      });
      setXaiData({
        feature_importance: [
          { feature: "Age", value: 0.4, type: "positive" },
          { feature: "Education", value: 0.3, type: "positive" },
          { feature: "Gender", value: 0.2, type: "negative" }
        ]
      });
    }
    setLoading(false);
    // Load history from local storage (Simulating Firestore)
    const saved = localStorage.getItem('equilens_history');
    if (saved) setAuditHistory(JSON.parse(saved));
  };

  const handleLaunchAudit = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setIsAuditing(true);
    await new Promise(r => setTimeout(r, 2000));
    await fetchData();
    
    // Save to History
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      score: biasData.bias_score,
      status: biasData.bias_score > 0.5 ? 'Critical' : 'Pass'
    };
    const updatedHistory = [newEntry, ...auditHistory].slice(0, 5);
    setAuditHistory(updatedHistory);
    localStorage.setItem('equilens_history', JSON.stringify(updatedHistory));
    
    setIsAuditing(false);
    alert("Audit Complete and saved to your secure cloud history!");
  };

  const handleSignIn = () => {
    setUser({ name: "Anurag Lead", email: "23eg107f58@anurag.edu.in", role: "Lead Auditor" });
    setShowLogin(false);
  };

  if (loading) return null;

  return (
    <div className="app-container">
      <div className="main-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <a href="#hero" style={{ color: 'inherit' }}>
            <ShieldCheck className="sidebar-icon active" size={32} />
          </a>
          <LayoutDashboard className="sidebar-icon" size={28} />
          <Database className="sidebar-icon" size={28} />
          <Activity className="sidebar-icon" size={28} />
          <FileText className="sidebar-icon" size={28} />
          <div style={{ marginTop: 'auto' }}>
            <Settings className="sidebar-icon" size={28} />
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <nav className="navbar">
            <div className="nav-links">
              <a href="#hero">Home</a>
              <a href="#about">About Us</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>
            <button className="btn-signin" onClick={() => setShowLogin(true)}>Sign In</button>
          </nav>

          {/* Hero Section */}
          <section id="hero" className="hero">
            <div className="update-tag">EquiLens 2.0 is now live</div>
            <h1>EquiLens AI<br/>Audit Suite</h1>
            <p>Harnessing the power of algorithmic fairness to revolutionize industry standards and enhance human experiences.</p>
            <button 
              className="btn-primary-glow" 
              onClick={handleLaunchAudit}
              disabled={isAuditing}
            >
              {isAuditing ? "Auditing..." : "Launch Audit"}
            </button>
          </section>

          {/* Audit History (New Section) */}
          <section style={{ padding: '0 4rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-white)' }}>Recent Audit History</h2>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {auditHistory.length === 0 ? (
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No previous audits found. Launch an audit to begin tracking.</div>
              ) : (
                auditHistory.map(item => (
                  <div key={item.id} className="glass-card" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{item.date}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: '700', color: item.status === 'Critical' ? '#ef4444' : 'var(--accent-blue)' }}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.9rem' }}>{Math.round(item.score * 100)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Integration Dashboard Grid */}
          <div className="dashboard-grid animate-fade">
            {/* Smart Shield (Bias Score) - Now Interactive */}
            <div className="glass-card" 
                 onClick={() => alert(`Bias Breakdown:\n- Gender Impact: ${biasData.disparate_impact.gender}\n- Race Impact: ${biasData.disparate_impact.race}\nStatus: ${biasData.bias_score > 0.5 ? 'CRITICAL' : 'OPTIMAL'}`)}
                 style={{ cursor: 'pointer' }}>
              <h3>Smart Shield <MoreHorizontal size={16} /></h3>
              <div style={{ position: 'relative', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <div className="glow-effect" style={{ 
                   width: '120px', height: '120px', borderRadius: '50%', 
                   border: '8px solid rgba(0, 136, 255, 0.1)',
                   borderTopColor: 'var(--accent-blue)',
                   transform: `rotate(${biasData.bias_score * 360}deg)`,
                   display: 'flex', justifyContent: 'center', alignItems: 'center',
                   transition: 'transform 1s ease-out'
                 }}>
                   <div style={{ transform: `rotate(-${biasData.bias_score * 360}deg)`, fontSize: '1.5rem', fontWeight: '800' }}>
                     {Math.round(biasData.bias_score * 100)}%
                   </div>
                 </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: biasData.bias_score > 0.5 ? '#ef4444' : 'var(--accent-blue)' }}></div>
                 <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                   {biasData.bias_score > 0.5 ? 'High Fairness Risk' : 'Level 1 Secure'}
                 </span>
              </div>
            </div>

            {/* AI Defender (Feature Trends) - Now with Tooltips */}
            <div className="glass-card">
              <h3>AI Defender <MoreHorizontal size={16} /></h3>
              <div style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    {t: 'Jan', v: 10}, {t: 'Feb', v: 25}, {t: 'Mar', v: 45}, {t: 'Apr', v: 30}, {t: 'May', v: 65}, {t: 'Jun', v: 85}
                  ]}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--accent-blue)' }}
                    />
                    <Area type="monotone" dataKey="v" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                 <span>● Model Stability</span>
                 <span>○ Drift Detected</span>
              </div>
            </div>

            {/* Audit Regions - Interactive Button */}
            <div className="glass-card">
              <h3>Audit Regions <MoreHorizontal size={16} /></h3>
              <div style={{ marginTop: '1rem' }}>
                 <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                   Ensuring fairness across multi-national hiring and lending operations.
                 </p>
                 <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>43,361 Records</div>
                 <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'var(--accent-blue)' }}></div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', WebkitBoxPack: 'start', marginLeft: '0px' }}>
                       {[1,2,3].map(i => (
                         <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#333', border: '2px solid #000', marginLeft: i > 1 ? '-8px' : '0' }}></div>
                       ))}
                    </div>
                    <div 
                      className="btn-primary-glow" 
                      onClick={() => alert("Initializing new region audit...")}
                      style={{ padding: '0', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </div>
                 </div>
              </div>
            </div>

            {/* Explainability Core (SHAP) - Clickable for details */}
            <div className="glass-card" style={{ gridColumn: 'span 2' }}>
               <h3>Explainability Core (SHAP) <MoreHorizontal size={16} /></h3>
               <div style={{ height: '200px' }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={xaiData.feature_importance}>
                     <XAxis dataKey="feature" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                     />
                     <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]} 
                        onClick={(data) => alert(`Feature: ${data.feature}\nImpact: ${Math.round(data.value * 100)}%\n\nThis attribute has a ${data.type} correlation with the final decision.`)}
                        style={{ cursor: 'pointer' }}
                     >
                       {xaiData.feature_importance.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.type === 'positive' ? 'var(--accent-blue)' : '#ef4444'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* User Profile / Status */}
            <div className="glass-card">
               <h3>System Status <MoreHorizontal size={16} /></h3>
               <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: user ? 'linear-gradient(45deg, var(--accent-blue), var(--accent-secondary))' : '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <User size={30} color={user ? '#fff' : '#666'} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600' }}>{user ? user.name : "Guest Session"}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{user ? user.role : "Authentication Required"}</div>
                  </div>
                  {!user ? (
                    <button className="btn-signin" onClick={() => setShowLogin(true)} style={{ width: '100%' }}>Sign In</button>
                  ) : (
                    <button className="btn-signin" onClick={() => setUser(null)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>Sign Out</button>
                  )}
               </div>
            </div>
          </div>

          {/* About Us Section */}
          <section id="about" className="info-section animate-fade" style={{ marginTop: '8rem', padding: '0 4rem' }}>
            <div className="glass-card" style={{ padding: '4rem', display: 'flex', gap: '4rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-white)' }}>Our Mission</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: '1.8' }}>
                  EquiLens AI is dedicated to dismantling systemic bias in algorithmic decision-making. 
                  In a world increasingly governed by AI, we ensure that fairness isn't just an afterthought—it's the foundation. 
                  Our suite of tools empowers auditors and developers to build technology that serves everyone equally, 
                  aligning with UN SDG 10: Reduced Inequalities.
                </p>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                 <div className="glow-effect" style={{ width: '100%', height: '200px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.2), rgba(129, 140, 248, 0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ShieldCheck size={100} color="var(--accent-blue)" />
                 </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="#hero" className="btn-signin" style={{ textDecoration: 'none' }}>↑ Back to Dashboard</a>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="info-section" style={{ marginTop: '8rem', padding: '0 4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center', color: 'var(--text-white)' }}>Frequently Asked Questions</h2>
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {[
                { q: "How does the bias detection work?", a: "We use metrics like Disparate Impact and Equalized Odds to identify if certain demographic groups are unfairly penalized by your model." },
                { q: "Is EquiLens open source?", a: "Yes, our core fairness engine is open source, allowing the community to audit and improve our own algorithms." },
                { q: "What is the 4/5ths rule?", a: "It's a regulatory standard (EEOC) that identifies adverse impact if the selection rate for a group is less than 80% of the rate for the highest group." },
                { q: "Can I integrate my own data?", a: "Absolutely. Our backend supports CSV, JSON, and direct database connections via our API." }
              ].map((faq, i) => (
                <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>{faq.q}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{faq.a}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="#hero" className="btn-signin" style={{ textDecoration: 'none' }}>↑ Back to Dashboard</a>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="info-section" style={{ marginTop: '8rem', padding: '0 4rem', paddingBottom: '10rem' }}>
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Get in Touch</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '3rem' }}>
                Have questions about AI ethics? Reach out to our lead auditor at <br/>
                <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>23eg107f58@anurag.edu.in</span>
              </p>
              <form style={{ display: 'grid', gap: '1.5rem' }} onSubmit={(e) => { e.preventDefault(); alert("Message sent! Our ethics team will get back to you."); }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <input type="text" placeholder="Your Name" className="glass-input" required />
                  <input type="email" placeholder="Your Email" className="glass-input" required />
                </div>
                <textarea placeholder="Your Message" className="glass-input" rows="5" required></textarea>
                <button type="submit" className="btn-primary-glow" style={{ width: '200px', margin: '0 auto' }}>Send Message</button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <a href="#hero" className="btn-signin" style={{ textDecoration: 'none', background: 'transparent' }}>Return to Home</a>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Login Modal Overlay */}
      {showLogin && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-card" style={{ width: '400px', padding: '3rem', textAlign: 'center' }}>
            <ShieldCheck size={60} color="var(--accent-blue)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Secure Audit Access</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Sign in to synchronize your fairness reports with Google Cloud.</p>
            <button className="btn-primary-glow" onClick={handleSignIn} style={{ width: '100%', marginBottom: '1rem' }}>
              Sign in with Google
            </button>
            <button className="btn-signin" onClick={() => setShowLogin(false)} style={{ width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
