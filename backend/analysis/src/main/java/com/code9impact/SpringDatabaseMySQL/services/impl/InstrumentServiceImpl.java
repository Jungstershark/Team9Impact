package com.code9impact.SpringDatabaseMySQL.services.impl;

import com.code9impact.SpringDatabaseMySQL.domains.Instrument;
import com.code9impact.SpringDatabaseMySQL.repositories.InstrumentRepository;
import com.code9impact.SpringDatabaseMySQL.services.InstrumentService;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class InstrumentServiceImpl implements InstrumentService {

    private final InstrumentRepository instrumentRepository;

    public InstrumentServiceImpl(InstrumentRepository instrumentRepository) {
        this.instrumentRepository = instrumentRepository;
    }

    @Override
    public Iterable<Instrument> getAllInstruments() {
        return instrumentRepository.findAll();
    }

    @Override
    public Optional<Instrument> getInstrumentById(String id) {
        return instrumentRepository.findById(id);
    }

    @Override
    public Iterable<Instrument> findInstruments(String instrumentGroup, String instrument, String department, String riskCountry, String exchange, String tradeCCY, String exchangeCCY) {
        return instrumentRepository.searchInstruments(instrumentGroup, instrument, department, riskCountry, exchange, tradeCCY, exchangeCCY);
    }

    @Override
    public Iterable<Instrument> findInstrumentsByInstrumentGroup(String instrumentGroup) {
        return instrumentRepository.findByInstrumentGroup(instrumentGroup);
    }

    @Override
    public Instrument addInstrument(Instrument newInstrument) {
        return instrumentRepository.save(newInstrument);
    }

    @Override
    public Iterable<Instrument> findInstrumentsByMultipleIds(List<String> ids) {
        return instrumentRepository.findByInstrumentIdIn(ids);
    }

    @Override
    public List<String> getDistinctInstrumentGroup() {
        return instrumentRepository.findDistinctInstrumentGroup();
    }

    @Override
    public List<String> getDistinctInstrument() {
        return instrumentRepository.findDistinctInstrument();
    }

    @Override
    public List<String> getDistinctDepartment() {
        return instrumentRepository.findDistinctDepartment();
    }

    @Override
    public List<String> getDistinctRiskCountry() {
        return instrumentRepository.findDistinctRiskCountry();
    }

    @Override
    public List<String> getDistinctExchange() {
        return instrumentRepository.findDistinctExchange();
    }

    @Override
    public List<String> getDistinctTradeCCY() {
        return instrumentRepository.findDistinctTradeCCY();
    }

    @Override
    public List<String> getDistinctSettlementCCY() {
        return instrumentRepository.findDistinctSettlementCCY();
    }

    @Override
    public Map<String, List<String>> getAllDistinctFields() {
        Map<String, List<String>> distinctFields = new HashMap<>();

        distinctFields.put("instrumentGroup", instrumentRepository.findDistinctInstrumentGroup());
        distinctFields.put("instrument", instrumentRepository.findDistinctInstrument());
        distinctFields.put("department", instrumentRepository.findDistinctDepartment());
        distinctFields.put("riskCountry", instrumentRepository.findDistinctRiskCountry());
        distinctFields.put("exchange", instrumentRepository.findDistinctExchange());
        distinctFields.put("tradeCCY", instrumentRepository.findDistinctTradeCCY());
        distinctFields.put("settlementCCY", instrumentRepository.findDistinctSettlementCCY());

        return distinctFields;
    }

}



