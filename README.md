<div align="center">
<p align="center">
  <img src="/shadowlevel/docs/banner.gif" alt="Banner" width="100%" />
</p>

<h1 align="center">
  <img 
    src="https://readme-typing-svg.herokuapp.com/?font=Orbitron&size=32&center=true&vCenter=true&width=600&height=80&duration=4000&lines=◇+Shadow+Level+◇&color=FFFFFF"
  />
</h1>

</div>

#### **[ STATUS: SISTEMA ONLINE ] — Controle o sistema com suas próprias mãos.**

ShadowLevel é uma simulação de interface holográfica imersiva, inspirada na estética de **Solo Leveling**.  
O projeto ganha vida através de uma IA que traduz **gestos físicos** em comandos do sistema, permitindo ao usuário controlar módulos de poder, música e combate usando apenas as mãos.

---

## 🎥 **Demonstração do Sistema**

<p align="center">
  <!-- EM BREVE -->
  <img src="./docs/demo_completa.gif" alt="Demonstração da IA de Gestos controlando o sistema ShadowLevel" width="800"/>
</p>

---

## 🛠️ **Tecnologias Usadas**

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, animações), JavaScript ES6  
- **IA (Oráculo):** Google MediaPipe HandLandmarker  
- **Animações:** Canvas API  
- **Áudio:** Web Audio API + Áudio 

---

## ⚡ **Funcionalidades Principais**

### **Interface Holográfica**
Design inspirado em ficção científica e magia, usando:
- Fonte Orbitron  
- Efeitos de glow  
- Blur  
- Partículas dinâmicas

### **Animações Dinâmicas**
Vários efeitos em canvas:
- Partículas  
- Runas giratórias  
- Equalizador circular  
- Ondas de choque  

### **Módulos Interativos**
Módulos principais:
- **Powers**
- **Music**
- **Duelo**

### **Módulo de Jogo**
Mini-game estilo *Parry*, com:
- Sistema de **HP**
- Sistema de **Postura**
- Barra de **Super**

### **Módulo de Mídia**
Player de música funcional com:
- Visualizador de áudio circular  
- Construído com Web Audio API  

### **Controle por IA**
Reconhecimento de gestos em tempo real via webcam.

---

## 🧠 **O Oráculo (IA de Gestos)**

A principal funcionalidade é o **Oráculo**, que traduz seus movimentos da mão em comandos.

### **Tecnologia Usada**
- **MediaPipe HandLandmarker (Google)**
- 100% rodando no navegador via JavaScript ES6 Modules

### **Funcionamento**
O script `backend/ai_controller.js`:
1. Ativa a webcam  
2. Analisa frames em tempo real  
3. Classifica o gesto entre os pré-definidos

---

## 💠 **Módulos Centrais (Interfaces)**

| Módulo | Print | Propósito |
|-------|--------|-----------|
| **Home** | <img src="/shadowlevel/docs/home.png" width="800"/> | Portal de entrada |
| **Central** | <img src="/shadowlevel/docs/central.png" width="800"/> | Hub do sistema |
| **Powers** | <img src="/shadowlevel/docs/powers.png" width="800"/> | Invocação de poderes via gestos |
| **Duelo** | <img src="/shadowlevel/docs/duel.png" width="800"/> | Mini-game estilo Parry |
| **Music** | <img src="/shadowlevel/docs/music.png" width="800"/> | Player holográfico + equalizador |
| **Sobre** | <img src="/shadowlevel/docs/sobre.png" width="800"/> | Documentação temática |

---

## ✋ **Gestos Mapeados**

| Gesto            | Powers             | Music            | Duelo                    |
|------------------|--------------------|------------------|---------------------------|
| ✊ Punho Fechado  | Ativa “Arise”    | Música Anterior  | Ruptura (Quebra o shield) |
| ✋ Mão Aberta     | Ativa “Aura”    | Play / Pause     | Defesa (Escudo)           |
| ☝️ Apontando      | Abre “Habilidades” | Próxima Música   | Ataque (Corte da Adaga)   |
| ✌️ 2 com os dedos | Mana               | -                | Arise (Habilidade)        |
| 🤙 Tá tranquilo   | Abre o Inventário   | -                | -                         |


---


## 🚀 **Ativação do Sistema (Como Acessar o Site)**

### **1. Acesse o site do projeto:**
`https://shadowlevel.netlify.app`

### **2. Vá em settings (Fica na esquerda da URL do site):**
<img src="/shadowlevel/docs/all.png" width="200"/>

### **3. Acesse as configurações do site:** 
<img src="/shadowlevel/docs/config.png" width="300"/>`

### **4. Habilite a webcam:**
<img src="/shadowlevel/docs/webcam.png" width="400"/>



