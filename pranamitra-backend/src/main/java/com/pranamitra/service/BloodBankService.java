package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.response.BloodBankResponse;

public interface BloodBankService {

    BloodBankResponse registerBloodBank(BloodBankRequest request);

    BloodBankResponse getBloodBankById(Long id);

    List<BloodBankResponse> getAllBloodBanks();

    List<BloodBankResponse> getBloodBanksByCity(String city);

    BloodBankResponse updateBloodBank(Long id, BloodBankRequest request);

    void deleteBloodBank(Long id);

}