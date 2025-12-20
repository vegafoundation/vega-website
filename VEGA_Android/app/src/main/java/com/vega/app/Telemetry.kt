package com.vega.app

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class Telemetry {
    suspend fun log(name: String, metadata: Map<String, String> = emptyMap()) {
        withContext(Dispatchers.IO) {
            Log.d("VEGA_Telemetry", "event=$name metadata=$metadata")
        }
    }
}
