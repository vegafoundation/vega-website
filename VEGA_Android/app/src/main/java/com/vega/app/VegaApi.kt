package com.vega.app

import com.squareup.moshi.Moshi
import kotlinx.coroutines.delay

class VegaApi {
    private val moshi = Moshi.Builder().build()

    suspend fun dashboard(): DashboardSnapshot {
        // TODO: Replace with Retrofit calls wired to Vega backend
        delay(50)
        return DashboardSnapshot(
            modules = listOf("Story Engine", "Vision Engine", "Soundscapes", "Infinity Loop"),
            status = "Online"
        )
    }
}

data class DashboardSnapshot(
    val modules: List<String>,
    val status: String
)
