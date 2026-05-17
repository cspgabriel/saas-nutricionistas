import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../components/FirebaseProvider';
import { Paciente } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Database,
  Stethoscope,
  Microscope,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

// Mock Diagnostico Nutricional data
const DIAGNOSTICO_MOCK = [
  { codigo: 'D01', descricao: 'Obesidade de Grau I' },
  { codigo: 'D02', descricao: 'Sobrepeso' },
  { codigo: 'D03', descricao: 'Eutrofia' },
  { codigo: 'D04', descricao: 'Desnutrição' },
  { codigo: 'D05', descricao: 'Deficiência de Ferro (Anemia)' },
  { codigo: 'D06', descricao: 'Diabetes Mellitus tipo 2' }
];

// Mock Servicos data
const TUSS_MOCK = [
  { codigo: '10101012', descricao: 'Consulta em consultório' },
  { codigo: '10101020', descricao: 'Consulta domiciliar' },
  { codigo: '10101039', descricao: 'Consulta online' },
  { codigo: '20104049', descricao: 'Avaliação antropométrica' },
  { codigo: '20104235', descricao: 'Exame de bioimpedância' }
];

export default function ConsultationPage() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, tenantId } = useAuth();
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'evolution');

  // Form states
  const [queixa, setQueixa] = useState('');
  const [hda, setHda] = useState('');
  const [exameFisico, setExameFisico] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [conduta, setConduta] = useState('');
  const [cidSearch, setCidSearch] = useState('');
  const [selectedCids, setSelectedCids] = useState<string[]>([]);
  
  const [tussSearch, setTussSearch] = useState('');
  const [selectedTuss, setSelectedTuss] = useState<string[]>([]);

  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiInput, setAiInput] = useState('');

  useEffect(() => {
    if (!patientId) return;
    const fetchPatient = async () => {
      const docRef = doc(db, 'pacientes', patientId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setPatient({ id: snap.id, ...snap.data() } as Paciente);
    };
    fetchPatient();
  }, [patientId]);

  const handleAiProcess = async () => {
    if (!aiInput) return;
    try {
      setIsAiProcessing(true);
      const res = await fetch('/api/ai/process-anamnesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setQueixa(data.queixaPrincipal || '');
      setHda(data.hda || '');
      setExameFisico(data.exameFisico || '');
      setConduta(data.conduta || '');
      toast.success('Informações processadas e organizadas com sucesso!');
      setAiInput('');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar as informações.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!user || !patientId || !tenantId) return;
    try {
      const now = new Date().toISOString();
      if (activeTab === 'anamnese') {
        await addDoc(collection(db, `pacientes/${patientId}/anamneses`), {
          pacienteId: patientId,
          queixaPrincipal: queixa,
          hda,
          userId: tenantId,
          createdAt: now
        });
      } else {
        await addDoc(collection(db, `pacientes/${patientId}/consultas`), {
          pacienteId: patientId,
          data: now,
          queixa,
          peso: parseFloat(peso) || null,
          altura: parseFloat(altura) || null,
          exameFisico,
          conduta,
          cid10: selectedCids,
          tuss: selectedTuss,
          userId: tenantId
        });
      }
      toast.success('Registro salvo com sucesso!');
      navigate(`/patients/${patientId}`);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar registro.');
    }
  };

  if (!patient) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl hover:bg-white/50 shrink-0"><ArrowLeft size={20} /></Button>
          <div className="overflow-hidden">
            <h2 className="text-xl font-bold truncate">{activeTab === 'anamnese' ? 'Nova Anamnese' : 'Nova Consulta'}</h2>
            <p className="text-sm text-apple-gray-dark font-medium italic truncate">Paciente: {patient.nome}</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-nutri-green hover:bg-green-600 text-white rounded-xl gap-2 shadow-lg shadow-green-500/20 px-8 w-full sm:w-auto">
          <Save size={18} />
          Salvar
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="apple-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Sparkles size={18} className="text-nutri-green" />
                Anamnese Estruturada Automática
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Cole aqui o texto da consulta ou dite as observações para o sistema organizar..."
                className="min-h-[120px] rounded-xl bg-white/40 border border-white/20 focus-visible:ring-nutri-green resize-none"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
              />
              <Button 
                onClick={handleAiProcess} 
                className="w-full bg-white/60 hover:bg-white/80 text-[#007AFF] font-bold rounded-xl gap-2 border-none backdrop-blur-sm"
                disabled={isAiProcessing}
              >
                {isAiProcessing ? 'Processando...' : 'Organizar Automaticamente'}
              </Button>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white/40 backdrop-blur-md mb-6 w-fit rounded-xl p-1 border border-white/20">
                  <TabsTrigger value="evolution" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Acompanhamento Nutricional</TabsTrigger>
                  <TabsTrigger value="anamnese" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Anamnese Completa</TabsTrigger>
                </TabsList>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Motivo da Consulta</label>
                    <Input 
                      placeholder="Principal objetivo da consulta hoje" 
                      className="rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                      value={queixa}
                      onChange={e => setQueixa(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Anamnese Alimentar e Saúde</label>
                    <Textarea 
                      placeholder="Histórico alimentar, rotina, medicamentos..." 
                      className="min-h-[200px] rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                      value={hda}
                      onChange={e => setHda(e.target.value)}
                    />
                  </div>

                  {activeTab === 'evolution' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Peso (kg)</label>
                          <Input 
                            type="number"
                            placeholder="Ex: 70.5" 
                            className="rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                            value={peso}
                            onChange={e => setPeso(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Altura (cm)</label>
                          <Input 
                            type="number"
                            placeholder="Ex: 175" 
                            className="rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                            value={altura}
                            onChange={e => setAltura(e.target.value)}
                          />
                        </div>
                      </div>
                      {(peso && altura) && (
                        <div className="p-3 bg-white/30 rounded-xl border border-white/40 text-sm font-medium">
                          IMC Calculado: <span className="font-bold text-nutri-green">{(parseFloat(peso) / Math.pow(parseFloat(altura) / 100, 2)).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Avaliação Antropométrica Detalhada</label>
                        <Textarea 
                          placeholder="Perímetros, bioimpedância, dobras cutâneas..." 
                          className="rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                          value={exameFisico}
                          onChange={e => setExameFisico(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Conduta / Plano Alimentar</label>
                    <Textarea 
                      placeholder="Orientações, suplementação, metas dietéticas..." 
                      className="min-h-[120px] rounded-xl border-white/40 bg-white/40 focus-visible:ring-nutri-green"
                      value={conduta}
                      onChange={e => setConduta(e.target.value)}
                    />
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Database size={16} />
                Diagnóstico Nutricional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 text-apple-gray-dark" size={16} />
                <Input 
                  placeholder="Pesquisar diagnóstico..." 
                  className="pl-8 h-9 rounded-lg text-sm apple-glass border-none"
                  value={cidSearch}
                  onChange={e => setCidSearch(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
                {DIAGNOSTICO_MOCK.filter(c => c.descricao.toLowerCase().includes(cidSearch.toLowerCase()) || c.codigo.includes(cidSearch)).map(c => (
                  <div 
                    key={c.codigo} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-apple-gray cursor-pointer text-xs"
                    onClick={() => !selectedCids.includes(c.codigo) && setSelectedCids([...selectedCids, c.codigo])}
                  >
                    <span className="font-bold w-10">{c.codigo}</span>
                    <span className="text-apple-gray-dark truncate flex-1 ml-2">{c.descricao}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
                {selectedCids.map(code => (
                  <div key={code} className="bg-nutri-green/10 text-nutri-green px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                    {code}
                    <button onClick={() => setSelectedCids(selectedCids.filter(c => c !== code))}>×</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 size={16} />
                Procedimentos e Consultas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 text-apple-gray-dark" size={16} />
                <Input 
                  placeholder="Pesquisar procedimento..." 
                  className="pl-8 h-9 rounded-lg text-sm apple-glass border-none"
                  value={tussSearch}
                  onChange={e => setTussSearch(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
                {TUSS_MOCK.filter(t => t.descricao.toLowerCase().includes(tussSearch.toLowerCase()) || t.codigo.includes(tussSearch)).map(t => (
                  <div 
                    key={t.codigo} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-apple-gray cursor-pointer text-xs"
                    onClick={() => !selectedTuss.includes(t.codigo) && setSelectedTuss([...selectedTuss, t.codigo])}
                  >
                    <span className="font-bold w-16">{t.codigo}</span>
                    <span className="text-apple-gray-dark truncate flex-1 ml-2">{t.descricao}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
                {selectedTuss.map(code => (
                  <div key={code} className="bg-green-500/10 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                    {code}
                    <button onClick={() => setSelectedTuss(selectedTuss.filter(t => t !== code))}>×</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
