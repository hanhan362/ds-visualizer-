package com.dsvisualizer.repository;

import com.dsvisualizer.entity.AlgorithmEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlgorithmRepository extends JpaRepository<AlgorithmEntity, String> {}
