import React from 'react';
import CompColors from 'complementary-colors';

const getComplementaryColor = ({ color }) => {
    var colo
}

export const Waves = ({ collectionColor }) => (
<svg viewBox="0 0 87 258" version="1.1" aria-label="">
    <g className={styles.stroke} stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
        <g transform="translate(-23.000000, -27.000000)" stroke={collectionColor} stroke-width="13">
            <g transform="translate(30.000000, 27.000000)">
                <path d="M38.8272916,257.292177 L38.8272916,254.693978 C40.4435881,247.40588 41.2517363,240.110398 41.2517363,232.807532 C41.2517363,221.853234 31.2018277,201.797488 31.2018277,189.252818 C31.2018277,176.708147 41.2517363,163.946407 41.2517363,149.293053 C41.2517363,134.6397 31.2018277,117.591928 31.2018277,103.359425 C31.2018277,89.9987434 41.2517363,78.5214872 41.2517363,66.1617696 C41.2517363,53.802052 31.5331422,28.7962359 31.2018277,20.7121198 C30.9809514,15.322709 31.7819491,9.93065296 33.6048209,4.53595169 L33.6048209,0.557825971" id="Line-39"></path>
                <path d="M71.0530981,257.292177 L71.0530981,254.693978 C72.6693945,247.40588 73.4775427,240.110398 73.4775427,232.807532 C73.4775427,221.853234 63.4276342,201.797488 63.4276342,189.252818 C63.4276342,176.708147 73.4775427,163.946407 73.4775427,149.293053 C73.4775427,134.6397 63.4276342,117.591928 63.4276342,103.359425 C63.4276342,89.9987434 73.4775427,78.5214872 73.4775427,66.1617696 C73.4775427,53.802052 63.7589486,28.7962359 63.4276342,20.7121198 C63.2067579,15.322709 64.0077556,9.93065296 65.8306273,4.53595169 L65.8306273,0.557825971" id="Line-39-Copy"></path>
                <path d="M7.79503354,257.292177 L7.79503354,254.693978 C9.41132999,247.40588 10.2194782,240.110398 10.2194782,232.807532 C10.2194782,221.853234 0.169569658,201.797488 0.169569658,189.252818 C0.169569658,176.708147 10.2194782,163.946407 10.2194782,149.293053 C10.2194782,134.6397 0.169569658,117.591928 0.169569658,103.359425 C0.169569658,89.9987434 10.2194782,78.5214872 10.2194782,66.1617696 C10.2194782,53.802052 0.500884123,28.7962359 0.169569658,20.7121198 C-0.0513066522,15.322709 0.749691058,9.93065296 2.57256279,4.53595169 L2.57256279,0.557825971" id="Line-39-Copy-2"></path>
            </g>
        </g>
    </g>
</svg>
);

export const Squares = ({ collectionColor }) => (
<svg viewBox="0 0 101 232"  aria-label="" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.6" stroke-linecap="square" stroke-linejoin="round">
        <g className={styles.stroke} transform="translate(-148.000000, -40.000000)" stroke={collectionColor} stroke-width="13">
            <g transform="translate(156.000000, 48.000000)">
                <path d="M1.1167865,37.3877001 L41.4575933,1.39901351"></path>
                <path d="M22.4038235,196.308286 L62.7446304,160.319599"></path>
                <path d="M21.2834532,55.3787098 L61.62426,19.3900232"></path>
                <path d="M42.5704902,214.299295 L82.911297,178.310609"></path>
                <path d="M22.4038235,125.343747 L62.7446304,89.3550608"></path>
                <path d="M1.1184254,108.350776 L81.7909267,36.3815323"></path>
                <path d="M1.1184254,179.315314 L81.7909267,107.346071"></path>
            </g>
        </g>
    </g>
</svg>
);

export const Triangles = ({ collectionColor }) => (
<svg viewBox="0 0 75 252"  aria-label="" version="1.1">    
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke-linejoin="round">
        <g stroke={collectionColor} transform="translate(-287.000000, -39.000000)" stroke-width="11">
            <g transform="translate(324.500000, 164.500000) rotate(90.000000) translate(-324.500000, -164.500000) translate(204.000000, 133.000000)">
                <polygon transform="translate(66.949155, 19.767006) scale(1, -1) translate(-66.949155, -19.767006) " points="66.9491552 0.124864556 93.4504572 39.4091474 40.4478533 39.4091474"></polygon>
                <polygon transform="translate(140.676834, 19.767006) scale(1, -1) translate(-140.676834, -19.767006) " points="140.676834 0.124864556 167.178136 39.4091474 114.175532 39.4091474"></polygon>
                <polygon transform="translate(214.404512, 19.767006) scale(1, -1) translate(-214.404512, -19.767006) " points="214.404512 0.124864556 240.905814 39.4091474 187.90321 39.4091474"></polygon>
                <polygon points="102.286399 23.3171783 128.787701 62.6014612 75.7850972 62.6014612"></polygon>
                <polygon points="27.0923394 23.3171783 53.5936413 62.6014612 0.591037437 62.6014612"></polygon>
                <polygon points="177.480459 23.3171783 203.981761 62.6014612 150.979157 62.6014612"></polygon>
            </g>
        </g>
    </g>
</svg>
);