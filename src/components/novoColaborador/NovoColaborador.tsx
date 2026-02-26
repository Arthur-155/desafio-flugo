import Paginacao from "./paginacao/Paginacao"
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import React from "react";
import './novoColaborador.css'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/FirebaseConfig"; // ajuste o caminho
import { collection, addDoc } from "firebase/firestore";
import { Collections } from "@mui/icons-material";

function NovoColaborador() {

    //states

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = [{ label: 'Infos Basicas', }, { label: 'Infos Profissionais', }];
    const [valor, setValor] = React.useState(0);
    const handleVoltar = (e: React.MouseEvent<HTMLButtonElement>) => { setActiveStep((prev) => prev - 1); }
    const [situacao, setSituacao] = React.useState(false);
    const [nome, setNome] = React.useState("");
    const [email, setEmail] = React.useState("");
    const ultimoPasso = activeStep === steps.length - 1;//aqui eu peguei o último
    const [nomeErro, setNomeErro] = React.useState<string | null>(null);
    const [emailErro, setEmailErro] = React.useState<string | null>(null);
    const [departamentoErro, setDepartamentoErro] = React.useState<string | null>(null);
    const [chip, setChip] = React.useState<string>("");
    const navigate = useNavigate();
    const [sucesso, setSucesso] = React.useState(false);
    const [limpador, setLimpador] = React.useState(false);//pra limpar o status do select

    //------------------------
    //Arrays
    const names = [
        'Design',
        'TI',
        'Marketing',
        'Produtos',
        'RH',
        'Vendas',
    ];

    //----------------------------
    //funções

    React.useEffect(() => {
        const pct = Math.round((activeStep / (steps.length - 1)) * 50);
        setValor(pct);
    }, [activeStep, steps.length]);

    //--

    const handleProximo = () => {
        if (activeStep === 0) {
            const ok = validarPrimeiroPasso();
            if (!ok) return

            setLimpador(false);
            setDepartamentoErro(null)
        }
        setActiveStep((prev) => prev + 1);
    }

    //--

    function validarPrimeiroPasso() {
        let preenchido = true;

        if (!nome.trim()) {
            setNomeErro("O nome precisa ser preenchido!");
            preenchido = false;
        } else setNomeErro(null);

        if (!email.trim()) {
            setEmailErro("O email precisa ser preenchido!");
            preenchido = false;
        } else setEmailErro(null);

        return preenchido;
    }

    //--

    function validarUltimoPasso() {

        if (!chip) {
            setDepartamentoErro("O departamento precisa ser preenchido!")
            return false;
        }
        setDepartamentoErro(null);

        return true;
    }

    //--

    React.useEffect(() => {
        if (activeStep === 1) {
            setLimpador(false);
            setDepartamentoErro(null);
        }
    }, [activeStep]);

    //--
    //Tentando enviar pro banco
    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!ultimoPasso) return;

        setLimpador(true);
        if (!validarUltimoPasso()) return;


        const payload = {
            nome,
            email,
            departamento: chip,
            status: situacao ? "Ativo" : "Inativo"
        }

        try {
            await addDoc(collection(db, "colaboradores"), payload)
            setSucesso(true);
            window.setTimeout(() => { navigate("/") }, 2000);
        }catch(erro){
            console.error(erro)
        }

        



    }

    //--

    return (
        <div className="novoColaborador">
            <Paginacao />
            <div className="sliderPai">
                <Box sx={{ width: '100%' }}>
                    <div className="filhoSlider">
                        <Slider
                            value={valor}
                            min={0}
                            max={100}
                            size="medium"
                            aria-label="auto"
                            valueLabelDisplay="auto"
                            sx={{
                                color: '#23c56f', '& .MuiSlider-thumb': { display: 'none', width: 0, height: 0 },
                            }}
                            className="controleSlider"
                        />
                        <p className="porcentagem">{`${valor}%`}</p>
                    </div>
                </Box>
            </div>

            <div className="preencherColaborador">
                <main className="subContainer">
                    <div className="passos">
                        <Box sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#23c56f', fontSize: '30px' }, maxWidth: 500 }}>
                            <Stepper activeStep={activeStep} orientation="vertical" >
                                {steps.map((step) => (
                                    <Step key={step.label}>
                                        <StepLabel
                                        >
                                            {step.label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </div>
                    <form className="formulario" onSubmit={handleSubmit}>

                        {activeStep === 0 && (
                            <>
                                <h1 className="infosBasicas">Informações Básicas</h1>
                                <div className="infoColaborador">
                                    <input type="text" name="titulo" id="titulo" placeholder="João da Silva"
                                        className="titulo" required value={nome} onChange={(e) => setNome(e.target.value)} />
                                    {nomeErro && <p className="erro">{nomeErro}</p>}

                                    <input type="email" name="email" id="email" placeholder="e.g.john@gmail.com"
                                        className="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {emailErro && <p className="erro">{emailErro}</p>}
                                    <FormGroup>
                                        <FormControlLabel
                                            label="Ativar Ao criar"
                                            control={
                                                <Switch
                                                    checked={situacao}
                                                    onChange={(e) => setSituacao(e.target.checked)}
                                                    sx={{
                                                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#23c56f", },
                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#23c56f", },
                                                        "& .MuiSwitch-track": { backgroundColor: "#bdbdbd", },
                                                    }}
                                                />
                                            }
                                        />
                                    </FormGroup>
                                </div>
                            </>
                        )}

                        {ultimoPasso && (
                            <>
                                <h1 className="infosProssionais">Informações Profissionais</h1>
                                <div className="controleUltimoPasso">
                                    <FormControl sx={{ m: 1, width: '98%' }} error={limpador && !!departamentoErro}>
                                        <InputLabel id="demo-chip-label">Selecione um departamento</InputLabel>
                                        <Select
                                            labelId="demo-chip-label"
                                            value={chip}
                                            onChange={(e) => { setChip(e.target.value as string); setDepartamentoErro(null) }}
                                            input={<OutlinedInput id="select-chip" label="Selecione um departamento" />}
                                        >
                                            {names.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        {limpador && departamentoErro && <p className="erro">{departamentoErro}</p>}

                                    </FormControl>
                                </div>
                            </>
                        )}
                        {sucesso && (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                Você cadastrou um colaborador com sucesso, voltando a página inicial.
                            </Alert>
                        )}
                        <div className="btnDecisivos">
                            <Button disabled={activeStep == 0} className={activeStep == 0 ? "btnDesativado" : "btnVoltar"} onClick={handleVoltar}>Voltar</Button>

                            <Button variant="contained" type={ultimoPasso ? "submit" : "button"} className="btnProximo" onClick={ultimoPasso ? undefined : handleProximo}>
                                {activeStep === 0 ? 'Próximo' : 'Concluir'}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}


export default NovoColaborador