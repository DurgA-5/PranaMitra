package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.entity.BloodBank;
import com.pranamitra.mapper.BloodBankMapper;
import com.pranamitra.repository.BloodBankRepository;
import com.pranamitra.service.BloodBankService;

@Service
public class BloodBankServiceImpl implements BloodBankService {

    private final BloodBankRepository bloodBankRepository;
    private final BloodBankMapper bloodBankMapper;

    public BloodBankServiceImpl(BloodBankRepository bloodBankRepository,
                                BloodBankMapper bloodBankMapper) {

        this.bloodBankRepository = bloodBankRepository;
        this.bloodBankMapper = bloodBankMapper;
    }

    @Override
    public BloodBankResponse registerBloodBank(BloodBankRequest request) {

        if (bloodBankRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        if (bloodBankRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("License number already exists.");
        }

        BloodBank bloodBank = bloodBankMapper.toEntity(request);

        BloodBank savedBloodBank = bloodBankRepository.save(bloodBank);

        return bloodBankMapper.toResponse(savedBloodBank);
    }

    @Override
    public BloodBankResponse getBloodBankById(Long id) {

        BloodBank bloodBank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank not found."));

        return bloodBankMapper.toResponse(bloodBank);
    }

    @Override
    public List<BloodBankResponse> getAllBloodBanks() {

        List<BloodBank> bloodBanks = bloodBankRepository.findAll();

        List<BloodBankResponse> responseList = new ArrayList<>();

        for (BloodBank bloodBank : bloodBanks) {
            responseList.add(bloodBankMapper.toResponse(bloodBank));
        }

        return responseList;
    }

    @Override
    public List<BloodBankResponse> getBloodBanksByCity(String city) {

        List<BloodBank> bloodBanks = bloodBankRepository.findByCityIgnoreCase(city);

        List<BloodBankResponse> responseList = new ArrayList<>();

        for (BloodBank bloodBank : bloodBanks) {
            responseList.add(bloodBankMapper.toResponse(bloodBank));
        }

        return responseList;
    }

    @Override
    public BloodBankResponse updateBloodBank(Long id, BloodBankRequest request) {

        BloodBank bloodBank = bloodBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Bank not found."));

        bloodBank.setBloodBankName(request.getBloodBankName());
        bloodBank.setLicenseNumber(request.getLicenseNumber());
        bloodBank.setEmail(request.getEmail());
        bloodBank.setMobileNumber(request.getMobileNumber());
        bloodBank.setAddress(request.getAddress());
        bloodBank.setCity(request.getCity());
        bloodBank.setState(request.getState());
        bloodBank.setPincode(request.getPincode());
        bloodBank.setManagerName(request.getManagerName());
        bloodBank.setOpeningTime(request.getOpeningTime());
        bloodBank.setClosingTime(request.getClosingTime());
        bloodBank.setAvailable24Hours(request.getAvailable24Hours());

        BloodBank updatedBloodBank = bloodBankRepository.save(bloodBank);

        return bloodBankMapper.toResponse(updatedBloodBank);
    }

    @Override
    public void deleteBloodBank(Long id) {

        if (!bloodBankRepository.existsById(id)) {
            throw new RuntimeException("Blood Bank not found.");
        }

        bloodBankRepository.deleteById(id);
    }
}