package com.vega.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VegaTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    DashboardScreen()
                }
            }
        }
    }
}

@Composable
fun DashboardScreen(viewModel: VegaViewModel = remember { VegaViewModel() }) {
    val state by viewModel.state.collectAsState()
    val scope = rememberCoroutineScope()

    Scaffold(topBar = {
        TopAppBar(title = { Text("VEGA Dashboard") })
    }) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text("Status: ${state.status}", style = MaterialTheme.typography.titleMedium)
            }
            items(state.modules) { module ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(12.dp)) {
                        Text(module, style = MaterialTheme.typography.titleMedium)
                        Text("Interactive, neon-infused module", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
            item {
                Button(onClick = { scope.launch { viewModel.playSoundscape("infinity_loop") } }) {
                    Text("Play Soundscape")
                }
            }
        }
    }
}
