import { HistoriaClinica } from "./historiaClinica.model";
import { HojaHistoria } from "./hojaHistoria.model";

export interface Enfermeria {
    Descripcion?: string,
    Abdomen?: string,
    CabezaYCuello?: string,
    EstadoGeneral?: string,
    Extremidades?: string,
    Fc?: string,
    Fr?: string,
    Genital?: string,
    Imc?: string,
    Neurologico?: string,
    Ojos?: string,
    Orl?: string,
    Peso?: string,
    RuidosCardiacos?: string,
    RuidosRespiratorios?: string,
    Sao2?: string,
    Ta?: string,
    Talla?: string,
    Temperatura?: string,
    Torax?: string,
    HistoriaClinica?: HistoriaClinica | number,
    HojaHistoria?: HojaHistoria | number,
    Id?: number,
    FechaCreacion?: Date,
    FechaModificacion?: Date,
    Activo?: boolean,
}