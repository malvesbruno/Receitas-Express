import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, limit, where, doc, getDoc, updateDoc, orderBy, deleteDoc, startAt, endAt, startAfter} from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth"
import { getStorage, ref, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const database = initializeApp(firebaseConfig);
const db = getFirestore(database);
const storage = getStorage(database)

const auth = getAuth(database);

const deleteImageFromStorage = async (imageUrl) => {
    const storage = getStorage();

    try {
        // Cria uma referência ao arquivo no Firebase Storage com base na URL
        const storageRef = ref(storage, imageUrl);

        // Deleta o arquivo
        await deleteObject(storageRef);
        console.log('Imagem deletada com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar a imagem:', error);
    }
};

const DeleteRecipe = async (id, url) => {
    try {
        // Referência ao documento da receita
        const recipeRef = doc(db, "receitas", id);
        
        // Deletar o documento
        await deleteDoc(recipeRef);

        console.log("Receita deletada com sucesso");
        await deleteImageFromStorage(url)
    } catch (error) {
        console.error("Erro ao deletar a receita: ", error);
    }
};

const GetPubs = async (cont) => {
    const receitas = [];
    
    // Supondo que a coleção de receitas no Firestore seja chamada de 'receitas'
    const receitasCollection = collection(db, "receitas");
    
    try {
        // Cria uma consulta que ordena por 'totalAvaliacao' de forma decrescente e limita a 10 documentos
        const q = query(receitasCollection, orderBy("totalAvaliacao", "desc"), limit(cont));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            // Pega o id único do documento e os dados da receita
            receitas.push({
                id: doc.id,  // Pega o id único do documento
                ...doc.data()  // Pega os outros dados da receita
            });
        });

        console.log(receitas); // Exibe as receitas com os ids
    } catch (error) {
        console.error("Erro ao buscar receitas: ", error);
    }

    return receitas;
};

const GetMorePubs = async (lastUsed, existingReceitas, cont) => {
    const receitas = [];
    const receitasCollection = collection(db, "receitas");
    const lastDocRef = lastUsed ? doc(db, "receitas", lastUsed) : null; // Se lastUsed é null, não usamos startAfter

    // Cria um Set para armazenar IDs existentes
    const existingIds = new Set(existingReceitas.map(receita => receita.id));

    try {
        // Cria uma consulta que ordena por 'totalAvaliacao' de forma decrescente e limita a 10 documentos
        const q = query(
            receitasCollection,
            orderBy("totalAvaliacao", "desc"),
            limit(cont),
            ...(lastDocRef ? [startAfter(lastDocRef)] : []) // Adiciona startAfter somente se lastDocRef não for null
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            // Pega o id único do documento e os dados da receita
            const receita = {
                id: doc.id,  // Pega o id único do documento
                ...doc.data()  // Pega os outros dados da receita
            };

            // Adiciona ao array se o id não estiver presente no conjunto
            if (!existingIds.has(receita.id)) {
                receitas.push(receita);
                existingIds.add(receita.id); // Adiciona o id ao conjunto para futuras verificações
            }
        });

        console.log(receitas); // Exibe as receitas com os ids
    } catch (error) {
        console.error("Erro ao buscar receitas: ", error);
    }

    return receitas;
}

const GetReceitasProfile = async (uuid) => {
    const receitas = [];

    console.log("Iniciando busca de receitas para usuário:", uuid);

    const receitasCollection = collection(db, "receitas");
    
    try {
        const q = query(receitasCollection, orderBy("totalAvaliacao", "desc"), where('usuario', '==', uuid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log("Nenhuma receita encontrada para este usuário.");
        }

        querySnapshot.forEach((doc) => {
            receitas.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log("Receitas encontradas:", receitas);
    } catch (error) {
        console.error("Erro ao buscar receitas: ", error);
    }

    return receitas;
};


const GetThePub = async (id_to_search) => {
    console.log("Iniciando consulta para ID:", id_to_search);
    try {
        const docRef = doc(db, "receitas", id_to_search); // Busca direta pelo ID do documento
        const docSnap = await getDoc(docRef); // Aguarda o resultado da promessa

        if (docSnap.exists()) {
            console.log("Documento encontrado:", docSnap.data());
            return docSnap.data(); // Retorna os dados do documento
        } else {
            console.log("Nenhum documento encontrado para esse ID");
            return null; // Documento não encontrado
        }
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        return null; // Retorna nulo em caso de erro
    }
};

const GetProfile = async(id_to_search) => {
    console.log("Iniciando consulta para ID:", id_to_search);
    if (typeof id_to_search !== 'string' || !id_to_search.trim()) {
        console.error(`ID de busca inválido.\n${id_to_search}`);
        return []; // Retorna uma lista vazia
    }

    try {
        const q = query(collection(db, "usuários"), where('Id', '==', id_to_search));
        const querySnapshot = await getDocs(q);
        console.log("Número de documentos encontrados:", querySnapshot.size);
        const perfil = querySnapshot.docs.map((doc) => {
            console.log("Documento encontrado:", doc.data());
            return doc.data();
        });
        return perfil;
    } catch (error) {
        console.error("Erro ao consultar o perfil:", error);
        return []; // Retorna uma lista vazia em caso de erro
    }
}

const SignUp = async(email, password) => {
    console.log(auth)
    try{
        let userCredential = await createUserWithEmailAndPassword(auth, email, password)
        let user = userCredential.user
        return user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            return 'email_already_in_use'
        } else{
            throw(error)
        }
    }
}

const Logout = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}

const LogIn = async(email, password) => {
    console.log(auth)
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let user = userCredential.user
        return user;

    } catch (error) {
        console.error(error);
        throw error
    }
}


const AddUser = async(email, nome, id, pp, receitas) =>{
    try{
        const docref = await addDoc(collection(db, 'usuários'), {
            Nome: nome,
            Email: email,
            Id: id,
            PP: pp,
            Receitas: receitas
        })
        console.log("Document written with ID: ", docref.id);
    } catch (error){
        console.error(error);
    }
}

const CheckUuid = async(uuid) => {
    try{
        const q = query(collection(db, "usuários"), where('id', '==', uuid))
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return false
        } else {
            return true
        }
} catch (error) {
    console.error(error)
}
}

const CheckEmail = async(email) => {
    const collectionRef = collection(db, "usuários"); // Substitua pelo nome da sua coleção
    try {
        // Crie uma consulta para encontrar documentos onde o campo 'email' é igual ao parâmetro
        const q = query(collectionRef, where("Email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log("Nenhum documento encontrado com esse e-mail.");
            return false; // Não encontrou nenhum documento com o e-mail
        } else {
            console.log("Documento(s) encontrado(s) com o e-mail.");
            return true; // Encontrou pelo menos um documento com o e-mail
        }
    } catch (error) {
        console.error("Erro ao buscar documentos: ", error);
        return false;
    }
}

const AddRecipe = async(name, ingredientes, modoPreparo, imgUrl, usuario, totalAvaliacao, quantidadeAvaliacao, data) => {
    try{
        const docref = await addDoc(collection(db, 'receitas'), {
            Nome: name,
            Ingredientes: ingredientes,
            ModoPreparo: modoPreparo,
            url : imgUrl,
            usuario : usuario,
            totalAvaliacao : totalAvaliacao,
            quantidadeAvaliacao : quantidadeAvaliacao,
            data : data
        }
    )
    console.log("Recipe written with ID: ", docref.id);
    }catch (error){
        console.log(error)
    }
}

const UpdateRecipeRate = async(docId, Rate, Quantity) => {
    try {
        const docRef = doc(db, "receitas", docId);
        await updateDoc(docRef, {
            quantidadeAvaliacao: Quantity,
            totalAvaliacao: Rate
        });
        } catch (error) {
        console.error("Erro ao atualizar documento: ", error);
        }
    }

    const UpdateRecipesLiked = async (uuid, json) => {
        try {
            // Primeiro, busque o documento que contém o campo `id` com o valor correspondente
            const q = query(collection(db, 'usuários'), where('Id', '==', uuid));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return;
            }
    
            // Assumindo que o UUID é único e você encontrará apenas um documento
            const docRef = doc(db, 'usuários', querySnapshot.docs[0].id);
    
            // Atualize o documento
            await updateDoc(docRef, {
                Receitas: json
            });
    
        } catch (error) {
            console.error("Erro ao atualizar documento: ", error);
        }
    }

    const UpdateRecipe = async(docId, nome, file, ingredientes, modo_preparo) => {
        try {
            const docRef = doc(db, "receitas", docId);
            await updateDoc(docRef, {
                Nome: nome,
                Ingredientes: ingredientes,
                ModoPreparo: modo_preparo,
                url: file
            });
            } catch (error) {
            console.error("Erro ao atualizar documento: ", error);
            }

    }

    const GetReceitasLiked = async (ids) => {
        // "ids" é uma lista de IDs de documentos
        if (!ids || ids.length === 0) {
            console.log('A lista de IDs está vazia');
            return;
        }
    
        try {
            const documents = [];
    
            for (const id of ids) {
                // Referência para o documento pelo ID
                const docRef = doc(db, "receitas", id);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    documents.push({
                        id: docSnap.id,
                        ...docSnap.data()
                    });
                } else {
                    console.log(`Documento com ID ${id} não encontrado`);
                }
            }
    
            console.log(documents);
            return documents;
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
        }
    };


const ReceitasNomeIgual = async (name) => {
    try {
        const q = query(collection(db, "receitas"), orderBy("totalAvaliacao", "desc"),  where("Nome", "==", name));
        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });

        console.log(results);
        return results;
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
    }
};

const ReceitasMesmoPrefixo = async (namePrefix) => {
    try {
        const q = query(
            collection(db, "receitas"),
            orderBy("Nome"),
            startAt(namePrefix),
            endAt(namePrefix + "\uf8ff")  // "\uf8ff" é um caractere especial que garante que busque até o final de nomes que começam com o prefixo
        );

        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });

        console.log(results);
        return results;
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
    }
};

const UpdatePerfil = async(uuid, name, email, pp) =>{
    try{
        const q = query(collection(db, 'usuários'), where('Id', '==', uuid));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return;
            }
    
            // Assumindo que o UUID é único e você encontrará apenas um documento
            const docRef = doc(db, 'usuários', querySnapshot.docs[0].id);
    
            // Atualize o documento
            await updateDoc(docRef, {
                Nome: name,
                Email: email,
                PP: pp
            });
            return true;
    
        } catch (error) {
            console.error("Erro ao atualizar documento: ", error);
            return false
        }
}

const UpdateEmailAuth = async(email) =>{
    try{
        const user = auth.currentUser;
        await updateEmail(user, email)
        return true;
    }catch(erro){
        console.error("Erro ao atualizar e-mail de autenticação: ", erro);
        return false;
    }
}

const DelAccount = async(uuid) => {
    try{
        const q = query(collection(db, 'usuários'), where('Id', '==', uuid));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                return;
            }

    
            // Assumindo que o UUID é único e você encontrará apenas um documento
            const docRef = doc(db, 'usuários', querySnapshot.docs[0].id);

            await deleteDoc(docRef)
            return true;
    } catch (error) {
        console.error("Erro ao deletar conta: ", error);
        return false;
    }
}

const DelAllReceitas = async(uuid) => {
    console.log("Iniciando busca de receitas para usuário:", uuid);

    const receitasCollection = collection(db, "receitas");
    
    try {
        const q = query(receitasCollection, orderBy("totalAvaliacao", "desc"), where('usuario', '==', uuid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log("Nenhuma receita encontrada para este usuário.");
            return true;
        }

        // Usar for...of para lidar com async/await corretamente
        for (const doc of querySnapshot.docs) {
            const docData = doc.data()
            const docRef = doc.ref;  // Pega a referência correta do documento
            if (docData.url){
                const url = docData.Url
                await deleteImageFromStorage(url)
            }
            await deleteDoc(docRef);
        }

        return true;
    } catch(error) {
        console.error("Erro ao deletar receitas: ", error);
        return false;
    }
}

const DeleteAccountAuth = async () => {
    const auth = getAuth(); 
    const user = auth.currentUser;

    if (user) {
        try {
            await user.delete();
            console.log("Usuário deletado com sucesso.");
            return true;
        } catch (error) {
            console.error("Erro ao deletar o usuário:", error);
            if (error.code === "auth/requires-recent-login") {
                console.log("O usuário precisa estar logado recentemente. Redirecionando para login...");
            }
            return false
        }
    } else {
        console.log("Nenhum usuário está autenticado.");
        return false
    }
};

const ResetSenha = async(email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("E-mail de redefinição de senha enviado.");
    } catch (error) {
        console.error("Erro ao enviar e-mail de redefinição de senha: ", error);
    }
}

  
export {GetPubs, GetThePub, GetProfile, SignUp, LogIn, Logout, AddUser, CheckUuid, CheckEmail, storage, AddRecipe, UpdateRecipeRate, UpdateRecipesLiked,
    GetReceitasProfile, DeleteRecipe, UpdateRecipe, GetReceitasLiked, ReceitasNomeIgual, ReceitasMesmoPrefixo, UpdatePerfil, UpdateEmailAuth,
    DelAccount, DelAllReceitas, DeleteAccountAuth, ResetSenha, GetMorePubs
};
