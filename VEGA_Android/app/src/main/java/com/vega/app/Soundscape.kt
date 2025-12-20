package com.vega.app

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

class Soundscape {
    suspend fun play(id: String) {
        withContext(Dispatchers.IO) {
            delay(25)
        }
    }
}
