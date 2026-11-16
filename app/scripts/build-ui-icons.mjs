import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {House,BookOpen,Headphones,GraduationCap,ChartNoAxesCombined,SlidersHorizontal,PanelLeftClose,PanelLeftOpen,Volume2,ArrowRight,Check,Target,Pencil,Shuffle,Users,Scale,TextCursorInput,Puzzle,Layers,RotateCcw} from 'lucide-react';
import {writeFileSync} from 'node:fs';
const icons={home:House,reading:BookOpen,practice:Headphones,exam:GraduationCap,progress:ChartNoAxesCombined,preferences:SlidersHorizontal,collapse:PanelLeftClose,expand:PanelLeftOpen,audio:Volume2,arrow:ArrowRight,check:Check,quiz:Target,write:Pencil,conjugation:Shuffle,plurals:Users,cases:Scale,dictation:Headphones,articles:TextCursorInput,sentences:Puzzle,flash:Layers,review:RotateCcw};
const symbols=Object.entries(icons).map(([id,Icon])=>`<symbol id="${id}" viewBox="0 0 24 24">${renderToStaticMarkup(React.createElement(Icon)).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</symbol>`).join('');
writeFileSync('public/lernspiel/ui-icons.svg',`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`);
