function poruka(ispravno, divi, broj){

    if(ispravno){

        Poruke.ocistiGresku(broj);
    }
    else{

        Poruke.postaviIdDivova(divi);
        Poruke.dodajPoruku(broj);
        Poruke.ispisiGreske();
    }
}